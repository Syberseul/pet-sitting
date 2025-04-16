import { DogInfo } from "@/Interface/dogInterface";
import { DogOwner } from "@/Interface/dogOwnerInterface";
import { NewDogTourInfo } from "@/Interface/dogTourInterface";
import store from "@/store";
import {
  Button,
  Checkbox,
  DatePicker,
  GetProps,
  List,
  Modal,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import DogTourDetails from "./DogTourDetails";

interface Props {
  isModalOpen: boolean;
  ownerInfo: DogOwner;
  afterCreate: () => void;
  handleClose: () => void;
}
const initDogOwnerInfo: DogOwner = { name: "", dogs: [], isFromWx: false };
// interface SubmitButtonProps {
//   form: FormInstance;
//   onSave: () => void;
//   dogList: DogListInfo[];
//   isLoading: boolean;
// }

// const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({
//   form,
//   children,
//   onSave,
//   dogList,
//   isLoading,
// }) => {
//   const [submittable, setSubmittable] = React.useState<boolean>(false);

//   // Watch all values
//   const values = Form.useWatch([], form);

//   useEffect(() => {
//     form
//       .validateFields({ validateOnly: true })
//       .then(() => setSubmittable(dogList.length > 0))
//       .catch(() => setSubmittable(false));
//   }, [form, values, dogList]);

//   return (
//     <Button
//       type="primary"
//       htmlType="submit"
//       disabled={!submittable}
//       onClick={onSave}
//       loading={isLoading}
//     >
//       {children}
//     </Button>
//   );
// };

const { RangePicker } = DatePicker;
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const CreateDogTour: React.FC<Props> = ({
  isModalOpen,
  ownerInfo,
  afterCreate,
  handleClose,
}) => {
  const [owner, setOwner] = useState<DogOwner>(initDogOwnerInfo);
  const [tourList, setTourList] = useState<NewDogTourInfo[]>([]);
  const [ownerList, setOwnerList] = useState<DogOwner[]>([]);
  const [isFixedOwner, setIsFixedOwner] = useState<boolean>(false);
  const [ownerDogs, setOwnerDogs] = useState<DogInfo[]>([]);
  const [allToursInSamePeriod, setAllToursInSamePeriod] =
    useState<boolean>(true);
  const [dateRange, setDateRange] = useState<
    [string, string] | null | undefined
  >();

  useEffect(() => {
    if (!isModalOpen) {
      setOwner(initDogOwnerInfo);
      setTourList([]);
      setIsFixedOwner(false);
      setOwnerDogs([]);
      setAllToursInSamePeriod(true);
      setDateRange(null);
    } else {
      if (ownerInfo?.uid) {
        setIsFixedOwner(true);
        setOwner(ownerInfo);

        console.log(ownerInfo);
        setOwnerDogs(ownerInfo.dogs as DogInfo[]);
      } else {
        setIsFixedOwner(false);
        const dogOwners = store.getState().dogOwners;
        setOwnerList(dogOwners);

        console.log(dogOwners);
        setOwnerDogs([]);
      }
      console.log(ownerDogs);

      setAllToursInSamePeriod(true);

      setTourList([]);
    }
  }, [isModalOpen]);

  useEffect(() => {
    const { dogs } = owner;
    setOwnerDogs(dogs as DogInfo[]);
  }, [owner]);

  const handleSelectOwner = (value: string) => {
    if (!value) setOwner(initDogOwnerInfo);
    else {
      const owner = ownerList.find((owner) => owner.uid == value);
      setOwner(owner as DogOwner);
    }
  };

  const handleDateRangeSelect: RangePickerProps["onChange"] = (
    _dates,
    dateStrings
  ) => {
    setDateRange(dateStrings);
  };

  const handleAddTour = () => {
    // afterCreate();
    console.log(ownerDogs);
  };

  const handleDogTourChange = (dogTour: NewDogTourInfo) => {
    setTourList((prevTours) =>
      prevTours.map((tour) => (tour.dogId == dogTour.dogId ? dogTour : tour))
    );
  };

  return (
    <Modal
      title="添加寄养"
      open={isModalOpen}
      onCancel={handleClose}
      footer={
        <>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleAddTour} type="primary">
            添加
          </Button>
        </>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          justifyContent: "center",
          columnGap: "10px",
        }}
      >
        {isFixedOwner ? (
          <>
            <p>寄养主人：{owner.name}</p>
          </>
        ) : (
          <>
            {isFixedOwner ? null : ownerList.length ? (
              <div
                style={{
                  display: "flex",
                  columnGap: "10px",
                  alignItems: "center",
                }}
              >
                <p style={{ width: "80px" }}>寄养者:</p>
                <Select
                  showSearch
                  placeholder="选择一位寄养者"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  onSelect={(e) => handleSelectOwner(e)}
                  options={ownerList.map((owner) => ({
                    ...owner,
                    value: owner.uid,
                    label: owner.name ?? "匿名",
                  }))}
                  value={owner.uid}
                  style={{
                    minWidth: "200px",
                    maxWidth: "200px",
                  }}
                />
              </div>
            ) : (
              "还没有寄养者"
            )}
          </>
        )}

        {ownerDogs.length ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "10px",
              width: "95%",
            }}
          >
            {ownerDogs.length > 1 ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: "10px",
                }}
              >
                <Checkbox
                  onChange={() => setAllToursInSamePeriod((prev) => !prev)}
                  checked={allToursInSamePeriod}
                >
                  同时寄取
                </Checkbox>

                {allToursInSamePeriod && (
                  <RangePicker
                    placeholder={["起始时间", "结束时间"]}
                    onChange={handleDateRangeSelect}
                  />
                )}
              </div>
            ) : null}
            {ownerDogs.map((dog) => (
              <List.Item key={dog.uid}>
                <DogTourDetails
                  dogInfo={dog}
                  dateRange={dateRange}
                  onDogTourChange={handleDogTourChange}
                  allToursInSamePeriod={allToursInSamePeriod}
                />
              </List.Item>
            ))}
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default CreateDogTour;
