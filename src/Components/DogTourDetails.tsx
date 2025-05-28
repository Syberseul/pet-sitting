import { BreedInfo, DogInfo, DogTourList } from "@/Interface/dogInterface";
import { DogTourInfo, NewDogTourInfo } from "@/Interface/dogTourInterface";
import { getBreedInfo } from "@/util/breedMap";
import { DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  GetProps,
  Input,
  InputNumber,
  Popconfirm,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

interface Props {
  dogInfo: DogInfo;
  dateRange: [string, string] | null | undefined;
  onDogTourChange?: (tour: NewDogTourInfo | DogTourInfo) => void;
  allToursInSamePeriod: boolean;
  initDailyPrice?: number;
  initNotes?: string[];
}

const defaultBreedInfo: BreedInfo = {
  name: "",
  normalWeightRange: [0, 0],
};

const defaultDogTourList: DogTourList = {
  startDate: "",
  endDate: "",
  dailyPrice: 0,
  weight: 0,
  notes: [],
  checked: true,
};

const { RangePicker } = DatePicker;
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const DogTourDetails: React.FC<Props> = ({
  dogInfo,
  dateRange,
  onDogTourChange,
  allToursInSamePeriod,
  initDailyPrice,
  initNotes,
}) => {
  const [breedInfo, setBreedInfo] = useState<BreedInfo>(defaultBreedInfo);
  const [dogTour, setDogTour] = useState<DogTourList>(defaultDogTourList);
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    const info = getBreedInfo(dogInfo.breedName);
    setBreedInfo(info as BreedInfo);
    setDogTour({
      startDate: dogTour.startDate,
      endDate: dogTour.endDate,
      dailyPrice: info!.dailyPrice as number,
      weight: dogInfo.weight ?? 0,
      notes: dogTour.notes,
      checked: dogInfo.alive,
    });
  }, [dogInfo]);

  useEffect(() => {
    if (!dateRange) return;

    const [start, end] = dateRange;
    setDogTour({
      ...dogTour,
      startDate: start,
      endDate: end,
      dailyPrice: initDailyPrice!,
      notes: initNotes!,
    });
  }, [dateRange, initDailyPrice, initNotes]);

  useEffect(() => {
    syncTourDetails();
  }, [dogTour]);

  const handleDateRangeSelect: RangePickerProps["onChange"] = (
    _dates,
    dateStrings
  ) => {
    setDogTour({
      ...dogTour,
      startDate: dateStrings[0],
      endDate: dateStrings[1],
    });
    syncTourDetails();
  };

  const handleDailyPriceChange = (dailyPrice: number | null) => {
    setDogTour({
      ...dogTour,
      dailyPrice: dailyPrice ?? 0,
    });
    syncTourDetails();
  };

  const handleChangeNote = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value);
  };

  const handleAddNote = () => {
    if (!note) return;
    setDogTour((prev) => ({
      ...prev,
      notes: [...prev.notes, note],
    }));
    setNote("");
    syncTourDetails();
  };

  const handleRemoveNote = (index: number) => {
    setDogTour((prev) => ({
      ...prev,
      notes: prev.notes.filter((_n, idx) => index != idx),
    }));
    syncTourDetails();
  };

  const syncTourDetails = () => {
    if (onDogTourChange) {
      onDogTourChange({
        dogId: dogInfo.uid,
        dogName: dogInfo.dogName,
        breedType: dogInfo.breedType,
        breedName: dogInfo.breedName,
        ownerId: dogInfo.ownerId,
        startDate: dogTour.startDate ?? "",
        endDate: dogTour.endDate ?? "",
        notes: dogTour.notes,
        dailyPrice: dogTour.dailyPrice,
        weight: dogInfo.weight,
        checked: dogTour.checked,
        uid: dogInfo.uid ?? "",
      });
    }
  };

  return (
    <div
      style={{
        border: "1px solid #faf",
        borderRadius: "10px",
        padding: "0 10px",
        width: "100%",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "end" }}
      >
        <Button
          color={dogTour.checked ? "danger" : "primary"}
          variant="solid"
          onClick={() => {
            setDogTour((prev) => ({ ...prev, checked: !prev.checked }));
          }}
          disabled={!dogInfo.alive}
        >
          {dogTour.checked ? "移除本次寄养" : "添加本次寄养"}
        </Button>
      </div>

      <div style={{ display: "flex", columnGap: "10px", alignItems: "center" }}>
        <p style={{ width: "90px" }}>狗狗名字：</p>
        <p>
          {dogInfo.dogName} ({breedInfo.name}) - 体重 (
          {dogInfo.weight ? `${dogInfo.weight} kg` : "未知"})
        </p>
      </div>

      <div style={{ display: "flex", columnGap: "10px", alignItems: "center" }}>
        <p style={{ width: "90px" }}>接送日期：</p>
        <RangePicker
          placeholder={["起始时间", "结束时间"]}
          onChange={handleDateRangeSelect}
          value={[
            dogTour.startDate ? dayjs(dogTour.startDate) : null,
            dogTour.endDate ? dayjs(dogTour.endDate) : null,
          ]}
          disabled={allToursInSamePeriod || !dogInfo.alive}
        />
      </div>

      <div style={{ display: "flex", columnGap: "10px", alignItems: "center" }}>
        <p style={{ width: "90px" }}>单日寄养费：</p>
        <InputNumber
          addonAfter="$"
          defaultValue={breedInfo.dailyPrice}
          onChange={(e) => handleDailyPriceChange(e)}
          value={dogTour.dailyPrice}
          disabled={!dogInfo.alive}
        />
      </div>

      {dogTour.notes.length ? (
        <div style={{ lineHeight: "15px" }}>
          <p>备忘录：</p>
          {dogTour.notes.map((note, index) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "default",
                borderBottom: "1px dashed black",
              }}
              key={index}
            >
              <p>{note}</p>
              <Popconfirm
                title="删除备忘录"
                description="你确定要删除这条备忘录吗？"
                onConfirm={(e) => {
                  e?.stopPropagation();
                  e?.preventDefault();
                  handleRemoveNote(index);
                }}
              >
                <DeleteOutlined />
              </Popconfirm>
            </div>
          ))}
        </div>
      ) : (
        <p>未添加备忘录，在下面输入内容并添加</p>
      )}

      <div
        style={{
          display: "flex",
          columnGap: "10px",
          alignItems: "center",
          padding: "5px 0",
        }}
      >
        <Input
          placeholder="输入备忘录内容..."
          onChange={handleChangeNote}
          value={note}
          disabled={!dogInfo.alive}
        />
        <Button
          color="primary"
          onClick={handleAddNote}
          disabled={!dogInfo.alive}
        >
          添加备忘录
        </Button>
      </div>
    </div>
  );
};

export default DogTourDetails;
