import { DogInfo } from "@/Interface/dogInterface";
import { DogOwner } from "@/Interface/dogOwnerInterface";
import {
  CreateTourFail,
  CreateTourSuccess,
  NewDogTourInfo,
} from "@/Interface/dogTourInterface";
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
import { createTour } from "@/APIs/dogTourApi";
import { useI18n } from "@/Context/languageContext";

interface Props {
  isModalOpen: boolean;
  ownerInfo: DogOwner;
  afterCreate: () => void;
  handleClose: () => void;
}
const initDogOwnerInfo: DogOwner = { name: "", dogs: [], isFromWx: false };

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
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState<boolean>(true);
  const [isCreatingTour, setIsCreatingTour] = useState<boolean>(false);

  const { t } = useI18n();

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

        setOwnerDogs(ownerInfo.dogs as DogInfo[]);
      } else {
        setIsFixedOwner(false);
        const dogOwners = store.getState().dogOwners;
        setOwnerList(dogOwners);
        setOwnerDogs([]);
      }
    }
  }, [isModalOpen]);

  useEffect(() => {
    const { dogs } = owner as DogOwner;
    setOwnerDogs(dogs as DogInfo[]);
  }, [owner]);

  useEffect(() => {
    const tempDogList: NewDogTourInfo[] = ownerDogs.map((dog) => ({
      dogId: dog.uid ?? "",
      dogName: dog.dogName,
      breedName: dog.breedName,
      breedType: dog.breedType,
      ownerId: dog.ownerId ?? "",
      weight: dog.weight ?? 0,
      startDate: "",
      endDate: "",
      dailyPrice: 0,
      notes: [],
      checked: dog.alive,
      sex: 0,
      desex: false,
    }));
    setTourList(tempDogList);
    setAllToursInSamePeriod(ownerDogs.length >= 2);
  }, [ownerDogs]);

  useEffect(() => {
    determineSubmitBtnDisable();
  }, [dateRange, tourList]);

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

  const handleAddTour = async () => {
    const checkedList = tourList.filter((tour) => tour.checked);

    const apis: Promise<CreateTourSuccess | CreateTourFail>[] = [];

    setIsCreatingTour(true);

    checkedList.forEach(async (tour) => apis.push(createTour(tour)));

    await Promise.all(apis);

    setIsCreatingTour(false);

    afterCreate();
  };

  const handleDogTourChange = (dogTour: NewDogTourInfo) => {
    setTourList((prevTours) =>
      prevTours.map((tour) => (tour.dogId == dogTour.dogId ? dogTour : tour))
    );
  };

  const determineSubmitBtnDisable = () => {
    const activeTours = tourList.filter((tour) => tour.checked);

    if (!activeTours.length) setSubmitBtnDisabled(true);
    else if (
      allToursInSamePeriod &&
      (!dateRange || !dateRange[0] || !dateRange[1])
    )
      setSubmitBtnDisabled(true);
    else if (
      !allToursInSamePeriod &&
      activeTours.some((tour) => !tour.startDate || !tour.endDate)
    )
      setSubmitBtnDisabled(true);
    else setSubmitBtnDisabled(false);
  };

  return (
    <Modal
      title={t.addTour}
      open={isModalOpen}
      onCancel={handleClose}
      footer={
        <>
          <Button onClick={handleClose}>{t.cancel}</Button>
          <Button
            onClick={handleAddTour}
            type="primary"
            disabled={submitBtnDisabled || isCreatingTour}
            loading={isCreatingTour}
          >
            {isCreatingTour ? t.creating : t.add}
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
            <p>
              {t.dogOwner} {owner.name}
            </p>
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
                <p style={{ width: "80px" }}>{t.dogOwner}</p>
                <Select
                  showSearch
                  placeholder={t.selectDogOwner}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  onSelect={(e) => handleSelectOwner(e)}
                  options={ownerList.map((owner) => ({
                    ...owner,
                    value: owner.uid,
                    label: owner.name ?? t.anonymous,
                  }))}
                  value={owner.uid}
                  style={{
                    minWidth: "200px",
                    maxWidth: "200px",
                  }}
                />
              </div>
            ) : (
              t.noSelectedOwner
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
                  {t.sameTourDate}
                </Checkbox>

                {allToursInSamePeriod && (
                  <RangePicker
                    placeholder={[t.startDate, t.endDate]}
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
