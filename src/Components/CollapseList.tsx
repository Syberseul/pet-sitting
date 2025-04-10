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
import EditDogLogModal from "./EditDogLog";
import { deleteDogLog } from "@/APIs/dogApi";
import { isCreateLogSuccess } from "@/Interface/dogInterface";

interface Props {
  data: DailyDataStructure;
  afterModify: () => void;
}

interface DogListChildren {
  name: string;
  iconType: string;
  dogLogId: string;
}

interface DisplayItem {}

function CollapseList({ data, afterModify }: Props) {
  const [listData, setListData] = useState<DisplayItem[]>([]);

  const [UID, setUID] = useState<string>("");
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);

  useEffect(() => {
    modifyList(data);
  }, [data]);

  const modifyList = (data: DailyDataStructure) => {
    const total: DogListChildren[] = [];
    const newComing: DogListChildren[] = [];
    const leaving: DogListChildren[] = [];

    data.activeDogs.map((aDog) => {
      const dog = {
        name: `${aDog.dogName} (${aDog.breedType})`,
        iconType: aDog.iconType,
        dogLogId: aDog.dogLogId,
      };

      total.push(dog);
    });

    data.startingDogs.map((aDog) => {
      const dog = {
        name: `${aDog.dogName} (${aDog.breedType})`,
        iconType: aDog.iconType,
        dogLogId: aDog.dogLogId,
      };

      newComing.push(dog);
      total.push(dog);
    });

    data.endingDogs.map((aDog) => {
      const dog = {
        name: `${aDog.dogName} (${aDog.breedType})`,
        iconType: aDog.iconType,
        dogLogId: aDog.dogLogId,
      };

      leaving.push(dog);
      total.push(dog);
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

    const getRow = (data: DogListChildren) => (
      <div
        key={data.dogLogId}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", columnGap: "5px", cursor: "default" }}>
          {getIcon(data.iconType)}
          <p>{data.name}</p>
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
      </div>
    );

    const res = [];

    res.push({
      key: "Total",
      label: `总览 (${total.length})`,
      children: <>{total.map((dog) => getRow(dog))}</>,
    });

    newComing.length &&
      res.push({
        key: "newComing",
        label: `新狗狗 (${newComing.length})`,
        children: (
          <>
            <>{newComing.map((dog) => getRow(dog))}</>
          </>
        ),
      });

    leaving.length &&
      res.push({
        key: "leaving",
        label: `接走 (${leaving.length})`,
        children: <>{leaving.map((dog) => getRow(dog))}</>,
      });

    setListData(res);
  };

  const handleClickEditIcon = (data: DogListChildren) => {
    const { dogLogId } = data;
    setUID(dogLogId);
    setEditModalVisible(true);
  };

  const handleClickRemoveIcon = async (data: DogListChildren) => {
    const { dogLogId } = data;

    const res = await deleteDogLog(dogLogId);

    if (isCreateLogSuccess(res)) afterModify();
  };

  const handleEditLog = () => {
    handleCloseModifyDogLogModal();
    afterModify();
  };

  const handleCloseModifyDogLogModal = () => {
    setUID("");
    setEditModalVisible(false);
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

      <EditDogLogModal
        uid={UID}
        visible={editModalVisible}
        onSuccess={handleEditLog}
        onCancel={handleCloseModifyDogLogModal}
      />
    </div>
  );
}

export default CollapseList;
