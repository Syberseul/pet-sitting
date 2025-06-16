import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { Button, Modal, Radio } from "antd";

import CreateDogOwner from "@/Components/CreateDogOwner";
import CreateDogTour from "@/Components/CreateDogTour";
import CalendarView from "./components/calendar";

import { modifyDogOwner, setDogOwners } from "@/store/modules/dogOwnersStore";

import { getDogOwners } from "@/APIs/dogOwnerApi";
import { extractFinishedTours, getTours } from "@/APIs/dogTourApi";

import {
  DogTourInfo,
  getToursSuccess,
  isGetTourSuccess,
} from "@/Interface/dogTourInterface";
import {
  DogOwner,
  getDogOwnersSuccess,
  isGetDogOwnerSuccess,
} from "@/Interface/dogOwnerInterface";

import "./index.scss";

import { DashboardView } from "@/enums";

import TimelineView from "./components/timeline";

import { exportDataAsCsv } from "@/util/helper";

const initDogOwnerInfo: DogOwner = { name: "", dogs: [], isFromWx: false };

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();

  const [tours, setTours] = useState<DogTourInfo[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [refreshFlag, setRefreshFlag] = useState(0);

  const [dogOwnerInfo, setDogOwnerInfo] = useState<DogOwner>(initDogOwnerInfo);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [openCreateTourModal, setOpenCreateTourModal] = useState(false);

  const [isLoadingDogOwners, setIsLoadingDogOwners] = useState(false);

  const [dashboardView, setDashboardView] = useState<DashboardView>(
    DashboardView.CALENDAR
  );

  const [isExtracting, setIsExtracting] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetchAllData();
  }, [refreshFlag]);

  const fetchAllData = async () => {
    setIsLoadingData(true);
    setIsLoadingDogOwners(true);

    const tours = await getTours();
    const dogOwners = await getDogOwners();

    if (isGetTourSuccess(tours)) {
      const { data } = tours as getToursSuccess;
      setTours(data);
    }

    if (isGetDogOwnerSuccess(dogOwners)) {
      const { data } = dogOwners as getDogOwnersSuccess;
      dispatch(setDogOwners(data));
    }

    setIsLoadingData(false);
    setIsLoadingDogOwners(false);
  };

  const refreshTour = () => {
    setRefreshFlag((prev) => prev + 1);
  };

  const handleCreateDogOwner = (ownerInfo: DogOwner) => {
    setOpenPopUp(true);
    setDogOwnerInfo(ownerInfo);
    dispatch(modifyDogOwner(ownerInfo));
  };

  const closePopUp = () => {
    setOpenPopUp(false);
    setDogOwnerInfo(initDogOwnerInfo);
  };

  const handleOpenCreateTourModal = () => {
    setOpenCreateTourModal(true);
    setOpenPopUp(false);
  };

  const handleCreateTour = () => {
    closeCreateTourModal();
    refreshTour();
  };

  const closeCreateTourModal = () => {
    setDogOwnerInfo(initDogOwnerInfo);
    setOpenCreateTourModal(false);
    setOpenPopUp(false);
  };

  const handleExtractAndDownload = async () => {
    if (isExtracting) return;

    setIsExtracting(true);

    try {
      const res = await extractFinishedTours();

      if (isGetTourSuccess(res)) {
        const successRes = res as getToursSuccess;
        if (successRes.data.length) {
          exportDataAsCsv(successRes.data, "tours_export");
          refreshTour();
        }
      }
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <CreateDogOwner afterCreate={handleCreateDogOwner} />
          <Button
            type="primary"
            onClick={handleOpenCreateTourModal}
            loading={isLoadingDogOwners}
          >
            添加寄养
          </Button>

          <Button
            ref={buttonRef}
            type="default"
            variant="outlined"
            color="danger"
            loading={isExtracting}
            onClick={handleExtractAndDownload}
          >
            删除并备份已完成的寄养
          </Button>
        </div>

        <Radio.Group
          value={dashboardView}
          onChange={(e) => setDashboardView(e.target.value)}
        >
          <Radio.Button value={DashboardView.CALENDAR}>日历显示</Radio.Button>
          <Radio.Button value={DashboardView.TIMELINE}>时间线显示</Radio.Button>
        </Radio.Group>
      </div>

      {dashboardView == DashboardView.CALENDAR ? (
        <CalendarView
          isLoadingData={isLoadingData}
          tours={tours}
          refreshTour={refreshTour}
        />
      ) : dashboardView == DashboardView.TIMELINE ? (
        <TimelineView
          isLoadingData={isLoadingData}
          tours={tours}
          refreshTour={refreshTour}
        />
      ) : (
        <></>
      )}

      <Modal
        title={<p>提示:</p>}
        footer={
          <>
            <Button onClick={() => closePopUp()}>再等等</Button>
            <Button onClick={() => handleOpenCreateTourModal()}>创建</Button>
          </>
        }
        onCancel={closePopUp}
        open={openPopUp}
      >
        您要现在为狗狗主人创建寄养吗？
      </Modal>

      <CreateDogTour
        isModalOpen={openCreateTourModal}
        ownerInfo={dogOwnerInfo}
        afterCreate={handleCreateTour}
        handleClose={closeCreateTourModal}
      />
    </>
  );
};

export default Dashboard;
