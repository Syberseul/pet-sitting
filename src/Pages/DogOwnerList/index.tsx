import { createDog, removeDog, updateDog } from "@/APIs/dogApi";
import { getDogOwners, removeDogOwner } from "@/APIs/dogOwnerApi";
import CreateDogOwner from "@/Components/CreateDogOwner";
import EditDogOwner from "@/Components/EditDogOwner";

import LoadingList from "@/Components/LoadingList";
import ModifyDogModal from "@/Components/ModifyDogModal";

import { DogInfo, DogInfoCreate } from "@/Interface/dogInterface";

import {
  DogOwner,
  getDogOwnersSuccess,
  isGetDogOwnerSuccess,
} from "@/Interface/dogOwnerInterface";

import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

import { Popconfirm, Table, Tooltip } from "antd";
import type { TableColumnsType } from "antd";

import { useEffect, useState } from "react";

function DogOwnerList() {
  const [isLoadingDogOwners, setIsLoadingDogOwners] = useState(false);
  const [dogOwners, setDogOwners] = useState<DogOwner[]>([]);

  const [selectedDogOwner, setSelectedDogOwner] = useState<DogOwner | null>(
    null
  );
  const [isEditDogOwnerModalOpen, setIsEditDogOwnerModalOpen] = useState(false);

  const [selectedDog, setSelectedDog] = useState<DogInfo | null>(null);
  const [isAddDogModalOpen, setIsAddDogModalOpen] = useState(false);
  const [isEditDogModalOpen, setIsEditDogModalOpen] = useState(false);
  const [isModifyingDog, setIsModifyingDog] = useState(false);

  useEffect(() => {
    loadDogOwners();
  }, []);

  const columns: TableColumnsType<DogOwner> = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "ID", dataIndex: "uid", key: "uid" },
    {
      title: "Contact No.",
      dataIndex: "contactNo",
      key: "contactNo",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Tooltip placement="left" title={"Add Dog"} color="green">
            <PlusOutlined
              style={{ cursor: "pointer", color: "green" }}
              onClick={() => {
                setSelectedDogOwner(record);
                setSelectedDog({
                  breedType: "",
                  breedName: "",
                  dogName: "",
                  weight: 0,
                  alive: true,
                  sex: 0,
                  desex: false,
                  uid: "",
                  ownerId: record.uid!,
                });
                setIsAddDogModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip placement="left" title={"Edit Dog Owner"} color="blue">
            <EditOutlined
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => {
                setSelectedDogOwner(record);
                setIsEditDogOwnerModalOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip placement="left" title={"Remove Dog Owner"} color="red">
            <Popconfirm
              title="删除狗狗主人"
              description="你确定要删除这个狗狗主人么?"
              onConfirm={(e) => handleRemoveDogOwner(e, record as DogOwner)}
            >
              <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  const expandedColumns = (
    owner: DogOwner
  ): TableColumnsType<DogInfo | DogInfoCreate> => [
    { title: "Dog Name", dataIndex: "dogName", key: "dogName" },
    {
      title: "Breed",
      dataIndex: "breedType",
      key: "breedType",
      render: (text, dog) => `${text} (${dog.breedName})`,
    },
    {
      title: "Sex",
      dataIndex: "sex",
      key: "sex",
      render: (text, dog) => {
        const gender = text == 0 ? "Female" : "Male";
        const desex = dog.desex ? "已绝育" : "未绝育";

        return `${gender} (${desex})`;
      },
    },
    {
      title: "Weight (kg)",
      dataIndex: "weight",
      key: "weight",
      render: (text) => (text ? `${text} kg` : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Tooltip placement="left" title={"Edit Dog"} color="blue">
            <EditOutlined
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => {
                setSelectedDogOwner(owner);
                setSelectedDog(record as DogInfo);
                setIsEditDogModalOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip placement="left" title={"Remove Dog"} color="red">
            <Popconfirm
              title="删除狗狗"
              description="你确定要删除这个狗狗么?"
              onConfirm={(e) => handleRemoveDog(e, record as DogInfo)}
            >
              <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  const loadDogOwners = async () => {
    setIsLoadingDogOwners(true);

    const response = await getDogOwners();

    if (isGetDogOwnerSuccess(response)) {
      const { data } = response as getDogOwnersSuccess;
      setDogOwners(
        data.map((d) => ({
          ...d,
          key: d.uid,
          dogs: d.dogs.map((dog) => ({
            ...dog,
            key: dog.uid,
          })),
        }))
      );
    }
    setIsLoadingDogOwners(false);
  };

  const handleEditOwner = (ownerInfo: DogOwner) =>
    setDogOwners(
      dogOwners.map((owner) => {
        if (owner.uid == ownerInfo.uid)
          return {
            ...ownerInfo,
            key: ownerInfo.uid,
            dogs: ownerInfo.dogs.map((dog) => ({
              ...dog,
              key: dog.uid,
            })),
          };
        return owner;
      })
    );

  const handleModifyDog = async (dogInfo: DogInfo) => {
    const { ownerId } = dogInfo;

    setIsModifyingDog(true);

    try {
      const response = dogInfo.uid
        ? await updateDog(dogInfo)
        : await createDog(dogInfo);

      if (response.error) console.log(response.error);
      else
        setDogOwners(
          dogOwners.map((owner) => {
            if (owner.uid == ownerId)
              return {
                ...owner,
                key: owner.uid,
                dogs: owner.dogs.some((dog) => dog.uid == dogInfo.uid)
                  ? owner.dogs.map((dog) => {
                      if (dog.uid == dogInfo.uid)
                        return {
                          ...dogInfo,
                          key: dogInfo.uid,
                        };
                      return dog;
                    })
                  : [
                      ...owner.dogs,
                      {
                        ...dogInfo,
                        key: dogInfo.uid,
                      },
                    ],
              };
            return owner;
          })
        );
    } catch (error) {
      console.log(error);
    }

    closeModifyDogModal();
  };

  const handleRemoveDogOwner = async (
    e: React.MouseEvent<HTMLElement, MouseEvent> | undefined,
    ownerInfo: DogOwner
  ) => {
    e?.stopPropagation();
    e?.preventDefault();
    try {
      const response = await removeDogOwner(ownerInfo.uid!);

      if (response.error) console.log(response.error);
      else {
        setDogOwners(dogOwners.filter((owner) => owner.uid != ownerInfo.uid));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveDog = async (
    e: React.MouseEvent<HTMLElement, MouseEvent> | undefined,
    dogInfo: DogInfo
  ) => {
    e?.stopPropagation();
    e?.preventDefault();
    setSelectedDog(dogInfo);
    setIsModifyingDog(true);
    try {
      const response = await removeDog(dogInfo);

      if (response.error) console.log(response.error);
      else {
        setDogOwners(
          dogOwners.map((owner) => {
            if (owner.uid == dogInfo.ownerId)
              return {
                ...owner,
                key: owner.uid,
                dogs: owner.dogs.filter((dog) => dog.uid != dogInfo.uid),
              };
            return owner;
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
    setIsModifyingDog(false);
  };

  const expandedRowRender = (dogOwner: DogOwner) => (
    <Table<DogInfo | DogInfoCreate>
      columns={expandedColumns(dogOwner)}
      dataSource={dogOwner.dogs}
      pagination={false}
    />
  );

  const closeModifyDogModal = () => {
    setIsAddDogModalOpen(false);
    setIsEditDogModalOpen(false);
    setSelectedDog(null);
    setSelectedDogOwner(null);
    setIsModifyingDog(false);
  };

  return isLoadingDogOwners ? (
    <LoadingList />
  ) : (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <CreateDogOwner afterCreate={loadDogOwners} />
      </div>
      <Table<DogOwner>
        columns={columns}
        dataSource={dogOwners}
        expandable={{ expandedRowRender }}
      />
      {isEditDogOwnerModalOpen ? (
        <EditDogOwner
          isModalOpen={isEditDogOwnerModalOpen}
          ownerInfo={selectedDogOwner!}
          afterEdit={(ownerInfo: DogOwner) => handleEditOwner(ownerInfo)}
          closeModal={() => {
            setSelectedDogOwner(null);
            setIsEditDogOwnerModalOpen(false);
          }}
        />
      ) : null}
      {isAddDogModalOpen || isEditDogModalOpen ? (
        <ModifyDogModal
          isModalOpen={isAddDogModalOpen || isEditDogModalOpen}
          dogInfo={selectedDog!}
          ownerInfo={selectedDogOwner!}
          afterModifyDogInfo={(dogInfo: DogInfo) => handleModifyDog(dogInfo)}
          closeModal={closeModifyDogModal}
          isModifyingDog={isModifyingDog}
        />
      ) : null}
    </>
  );
}

export default DogOwnerList;
