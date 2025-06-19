import { createDog, removeDog, updateDog } from "@/APIs/dogApi";
import { getDogOwners, removeDogOwner } from "@/APIs/dogOwnerApi";
import CreateDogOwner from "@/Components/CreateDogOwner";
import EditDogOwner from "@/Components/EditDogOwner";

import LoadingList from "@/Components/LoadingList";
import ModifyDogModal from "@/Components/ModifyDogModal";
import { useI18n } from "@/Context/languageContext";

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

  const { t } = useI18n();

  useEffect(() => {
    loadDogOwners();
  }, []);

  const columns: TableColumnsType<DogOwner> = [
    { title: t.name, dataIndex: "name", key: "name" },
    { title: t.id, dataIndex: "uid", key: "uid" },
    {
      title: t.contactNo,
      dataIndex: "contactNo",
      key: "contactNo",
      render: (text) => (text ? text : "-"),
    },
    {
      title: t.actions,
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Tooltip placement="left" title={t.addDog} color="green">
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
          <Tooltip placement="left" title={t.editDogOwner} color="blue">
            <EditOutlined
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => {
                setSelectedDogOwner(record);
                setIsEditDogOwnerModalOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip placement="left" title={t.removeDogOwner} color="red">
            <Popconfirm
              title={t.removeDogOwner}
              description={t.confirmRemoveDogOwnerText}
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
    { title: t.dogName, dataIndex: "dogName", key: "dogName" },
    {
      title: t.breed,
      dataIndex: "breedType",
      key: "breedType",
      render: (text, dog) => `${text} (${dog.breedName})`,
    },
    {
      title: t.sex,
      dataIndex: "sex",
      key: "sex",
      render: (text, dog) => {
        const gender = text == 0 ? t.genderFemale : t.genderMale;
        const desex = dog.desex ? t.desex : t.nonDesex;

        return `${gender} (${desex})`;
      },
    },
    {
      title: `${t.weight} (${t.weightUnit})`,
      dataIndex: "weight",
      key: "weight",
      render: (text) => (text ? `${text} ${t.weightUnit}` : "-"),
    },
    {
      title: t.actions,
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Tooltip placement="left" title={t.editDog} color="blue">
            <EditOutlined
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => {
                setSelectedDogOwner(owner);
                setSelectedDog(record as DogInfo);
                setIsEditDogModalOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip placement="left" title={t.removeDog} color="red">
            <Popconfirm
              title={t.removeDog}
              description={t.confirmRemoveDogText}
              onConfirm={(e) => handleRemoveDog(e, record as DogInfo)}
              cancelText={t.cancel}
              okText={t.delete}
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
