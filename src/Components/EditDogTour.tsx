import {
  DogTourInfo,
  isCreateTourSuccess,
  NewDogTourInfo,
} from "@/Interface/dogTourInterface";
import React, { useEffect, useState } from "react";
import DogTourDetails from "./DogTourDetails";
import { Button, Modal } from "antd";
import { DogInfo } from "@/Interface/dogInterface";
import { updateTour } from "@/APIs/dogTourApi";

interface Props {
  isModalOpen: boolean;
  tourInfo: DogTourInfo;
  afterModify: (tour: DogTourInfo) => void;
  handleClose: () => void;
}

const initDogInfo: DogInfo = {
  breedType: "",
  breedName: "",
  dogName: "",
  weight: 0,
  alive: true,
  ownerId: "",
  uid: "",
};

const EditDogTour: React.FC<Props> = ({
  isModalOpen,
  tourInfo,
  afterModify,
  handleClose,
}) => {
  const [tour, setTour] = useState<DogTourInfo | null>(null);
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState<boolean>(false);
  const [isUpdatingTour, setIsUpdatingTour] = useState<boolean>(false);
  const [dog, setDog] = useState<DogInfo>(initDogInfo);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  useEffect(() => {
    if (!isModalOpen) {
      setTour(null);
      setDog(initDogInfo);
      setDateRange(null);
    } else if (!tourInfo) handleClose();
    else {
      setTour(tourInfo);
      syncDogInfo(tourInfo);
    }
    setSubmitBtnDisabled(false);
  }, [isModalOpen]);

  useEffect(() => {
    setSubmitBtnDisabled(!tour?.startDate || !tour.endDate);
  }, [tour]);

  const syncDogInfo = (tourInfo: DogTourInfo) => {
    const dogInfo = {
      breedType: tourInfo.breedType,
      breedName: tourInfo.breedName,
      dogName: tourInfo.dogName,
      weight: tourInfo.weight,
      alive: true,
      ownerId: tourInfo.ownerId,
      uid: tourInfo.uid,
    };
    setDog(dogInfo);
    setDateRange([tourInfo.startDate, tourInfo.endDate]);
  };

  const handleModifyTour = async () => {
    if (!tour) return;

    setIsUpdatingTour(true);

    const res = await updateTour(tour);

    if (isCreateTourSuccess(res)) {
      afterModify(tour);
    }
    setIsUpdatingTour(false);
  };

  const handleDogTourChange = (newDogTour: DogTourInfo | NewDogTourInfo) => {
    if (!newDogTour.uid) return;

    setTour(newDogTour as DogTourInfo);
  };

  return (
    <Modal
      title="修改寄养"
      open={isModalOpen}
      onCancel={handleClose}
      footer={
        <>
          <Button onClick={handleClose}>取消</Button>
          <Button
            onClick={handleModifyTour}
            type="primary"
            disabled={submitBtnDisabled || isUpdatingTour}
            loading={isUpdatingTour}
          >
            {isUpdatingTour ? "更新中" : "更新"}
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
        {dog.uid ? (
          <DogTourDetails
            dogInfo={dog}
            dateRange={dateRange}
            onDogTourChange={handleDogTourChange}
            allToursInSamePeriod={false}
            initDailyPrice={tourInfo?.dailyPrice}
            initNotes={tourInfo.notes}
          />
        ) : null}
      </div>
    </Modal>
  );
};

export default EditDogTour;
