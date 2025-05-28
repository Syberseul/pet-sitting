import {
  DailyDataStructure,
  DailyEventType,
  DailyEventTypeColor,
} from "@/Interface/dashboardInterface";
import {
  CarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Collapse, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { DogTourInfo, isCreateTourSuccess } from "@/Interface/dogTourInterface";
import EditDogTour from "./EditDogTour";
import { deleteTour } from "@/APIs/dogTourApi";

interface Props {
  data: DailyDataStructure;
  afterModify: () => void;
}

interface DisplayItem {}

const initDogTourInfo: DogTourInfo = {
  uid: "",
  dogId: "",
  dogName: "",
  breedType: "",
  breedName: "",
  ownerId: "",
  startDate: "",
  endDate: "",
  notes: [],
  dailyPrice: 0,
  weight: 0,
  checked: true,
};

function CollapseList({ data, afterModify }: Props) {
  const [listData, setListData] = useState<DisplayItem[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [tourInfo, setTourInfo] = useState<DogTourInfo>(initDogTourInfo);

  useEffect(() => {
    modifyList(data);
  }, [data]);

  const modifyList = (data: DailyDataStructure) => {
    const total: DogTourInfo[] = [];
    const newComing: DogTourInfo[] = [];
    const leaving: DogTourInfo[] = [];

    data.activeDogs.map((aDog) => {
      total.push(aDog);
    });

    data.startingDogs.map((aDog) => {
      newComing.push(aDog);
      total.push(aDog);
    });

    data.endingDogs.map((aDog) => {
      leaving.push(aDog);
      total.push(aDog);
    });

    const getIcon = (iconType: string) => {
      const iconColor =
        DailyEventTypeColor[iconType as keyof typeof DailyEventTypeColor];

      switch (iconType) {
        case DailyEventType.WARNING:
          return (
            <ExclamationCircleOutlined
              style={{
                color: iconColor,
              }}
            />
          );
        case DailyEventType.SUCCESS:
          return (
            <ClockCircleOutlined
              style={{
                color: iconColor,
              }}
            />
          );
        case DailyEventType.ERROR:
          return (
            <CarOutlined
              style={{
                color: iconColor,
              }}
            />
          );
        default:
          return "";
      }
    };

    const getRow = (data: DogTourInfo) => {
      return (
        <>
          <div style={{ display: "flex", columnGap: "5px", cursor: "default" }}>
            {getIcon(data.iconType)}
            <p>
              {data.dogName} (
              {data.breedType == "" ? data.breedName : data.breedType})
            </p>
          </div>

          <div style={{ display: "flex", columnGap: "5px", cursor: "default" }}>
            <EditOutlined
              style={{ cursor: "pointer" }}
              onClick={() => handleClickEditIcon(data)}
            />
            <Popconfirm
              title="删除寄养"
              description="确定删除本次寄养？"
              onConfirm={() => handleClickRemoveIcon(data)}
              okText="删除"
              cancelText="暂时不"
            >
              <DeleteOutlined style={{ cursor: "pointer" }} />
            </Popconfirm>
          </div>
        </>
      );
    };

    const res = [];

    res.push({
      key: "Total",
      label: `总览 (${total.length})`,
      children: (
        <>
          {total.map((dog) => (
            <div
              key={`total-${dog.uid}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {getRow(dog)}
            </div>
          ))}
        </>
      ),
    });

    newComing.length &&
      res.push({
        key: "newComing",
        label: `新狗狗 (${newComing.length})`,
        children: (
          <>
            {newComing.map((dog) => (
              <div
                key={`new-${dog.uid}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {getRow(dog)}
              </div>
            ))}
          </>
        ),
      });

    leaving.length &&
      res.push({
        key: "leaving",
        label: `接走 (${leaving.length})`,
        children: (
          <>
            {leaving.map((dog) => (
              <div
                key={`leaving-${dog.uid}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {getRow(dog)}
              </div>
            ))}
          </>
        ),
      });

    setListData(res);
  };

  const handleClickEditIcon = (data: DogTourInfo) => {
    setTourInfo(data);
    setIsEditModalOpen(true);
  };

  const handleClickRemoveIcon = async (data: DogTourInfo) => {
    const { uid } = data;

    const res = await deleteTour(uid);

    if (isCreateTourSuccess(res)) afterModify();
  };

  const handleModifyTour = async () => {
    afterModify();
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setTourInfo(initDogTourInfo);
  };

  return (
    <div>
      <Collapse
        items={listData}
        defaultActiveKey={
          data.endingCount || data.startingCount
            ? ["newComing", "leaving"]
            : ["Total"]
        }
      />

      <EditDogTour
        isModalOpen={isEditModalOpen}
        tourInfo={tourInfo}
        afterModify={handleModifyTour}
        handleClose={handleCloseModal}
      />
    </div>
  );
}

export default CollapseList;
