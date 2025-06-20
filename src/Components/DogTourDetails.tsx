import { useI18n } from "@/Context/languageContext";
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
import dayjs, { Dayjs } from "dayjs";
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
  const [selectedRange, setSelectedRange] = useState<
    [Dayjs | null, Dayjs | null]
  >([
    dogTour.startDate ? dayjs(dogTour.startDate) : null,
    dogTour.endDate ? dayjs(dogTour.endDate) : null,
  ]);

  const { t } = useI18n();

  useEffect(() => {
    const info = getBreedInfo(dogInfo.breedName);
    setBreedInfo(info as BreedInfo);

    setDogTour((prev) => ({
      ...prev,
      dailyPrice: initDailyPrice ?? info?.dailyPrice ?? 0,
      weight: dogInfo.weight ?? 0,
      breedName: dogInfo.breedName,
      checked: dogInfo.alive,
      notes: initNotes ?? [],
    }));
  }, [dogInfo]);

  useEffect(() => {
    if (!dateRange) return;

    const [start, end] = dateRange;
    setDogTour((prev) => ({
      ...prev,
      startDate: start || prev.startDate,
      endDate: end || prev.endDate,
    }));

    setSelectedRange([start ? dayjs(start) : null, end ? dayjs(end) : null]);
  }, [dateRange]);

  useEffect(() => {
    syncTourDetails();
  }, [dogTour]);

  const handleDateRangeSelect: RangePickerProps["onChange"] = (
    dates,
    dateStrings
  ) => {
    setSelectedRange(dates!);

    if (dateStrings[0] && dateStrings[1]) {
      setDogTour((prev) => ({
        ...prev,
        startDate: dateStrings[0],
        endDate: dateStrings[1],
      }));
    }
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
        sex: dogInfo.sex,
        desex: dogInfo.desex,
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
          {dogTour.checked ? t.removeFromTour : t.includeInTour}
        </Button>
      </div>

      <div style={{ display: "flex", columnGap: "10px", alignItems: "center" }}>
        <p style={{ width: "90px" }}>{t.dogName}: </p>
        <p>
          {dogInfo.dogName} ({breedInfo.name}) - {t.weight} (
          {dogInfo.weight ? `${dogInfo.weight} ${t.weightUnit}` : t.unknown})
        </p>
      </div>

      <div style={{ display: "flex", columnGap: "10px", alignItems: "center" }}>
        <p style={{ width: "90px" }}>{t.dateRange}: </p>
        <RangePicker
          placeholder={[t.startDate, t.endDate]}
          onChange={handleDateRangeSelect}
          value={selectedRange}
          disabled={allToursInSamePeriod || !dogInfo.alive}
        />
      </div>

      <div style={{ display: "flex", columnGap: "10px", alignItems: "center" }}>
        <p style={{ width: "90px" }}>{t.dailyFee}: </p>
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
          <p>{t.notes}:</p>
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
                title={t.removeNote}
                description={t.confirmRemoveNote}
                onConfirm={(e) => {
                  e?.stopPropagation();
                  e?.preventDefault();
                  handleRemoveNote(index);
                }}
                okText={t.delete}
              >
                <DeleteOutlined />
              </Popconfirm>
            </div>
          ))}
        </div>
      ) : (
        <p>{t.noNotesText}</p>
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
          placeholder={t.addNotePlaceholder}
          onChange={handleChangeNote}
          value={note}
          disabled={!dogInfo.alive}
        />
        <Button
          color="primary"
          onClick={handleAddNote}
          disabled={!dogInfo.alive}
        >
          {t.addNote}
        </Button>
      </div>
    </div>
  );
};

export default DogTourDetails;
