import React, { useEffect, useState } from "react";

import { Display } from "@/enums";

import { DogInfoCreate, DogListInfo } from "@/Interface/dogInterface";
import { Button, Collapse, Popconfirm } from "antd";

import { v4 } from "uuid";

interface Props {
  display: Display;
  addedDogList?: DogListInfo[];
  onSave: (dogs: DogListInfo[]) => void;
}

const defaultDogInfoCreate: DogInfoCreate = {
  breedType: "",
  breedName: "",
  dogName: "",
  weight: 0,
  alive: true,
  sex: 0,
  desex: false,
};

import { DeleteOutlined } from "@ant-design/icons";

import DogSectionForm from "./DogSectionForm";

const ModifyDogSection: React.FC<Props> = ({
  display,
  onSave,
  addedDogList,
}) => {
  const [_dogs, setDogs] = useState<DogInfoCreate[]>([]);
  const [dogList, setDogList] = useState<DogListInfo[]>([]);
  const [showAddSection, setShowAddSection] = useState<boolean>(false);
  const [_dogInfoCreate, setDogInfoCreate] =
    useState<DogInfoCreate>(defaultDogInfoCreate);

  useEffect(() => {
    if (addedDogList?.length && !dogList.length) {
      const modifiedDogList = addedDogList.map(({ dog }) => ({
        dog: dog,
        key: dog.uid!,
        label: dog.dogName,
        children: (
          <div
            style={{
              display: "flex",
              columnGap: "10px",
              alignItems: "center",
            }}
          >
            <p>{dog.breedType}</p>
            {dog.weight ? <p>{dog.weight} kg</p> : null}
          </div>
        ),
        extra: (
          <Popconfirm
            title="删除狗狗"
            description="你确定要删除这个狗狗么?"
            onConfirm={(e) => {
              e?.stopPropagation();
              e?.preventDefault();
              handleRemoveDog({
                dog: dog,
                key: dog.uid!,
                label: dog.dogName,
              });
            }}
          >
            <DeleteOutlined />
          </Popconfirm>
        ),
      }));

      updateDogList(modifiedDogList);
    }
  }, [addedDogList]);

  const updateDogList = (newList: DogListInfo[]) => {
    setDogList(newList);
    onSave(newList); // 每次更新都通知父组件
  };

  const handleAddDog = () => {
    setDogInfoCreate(defaultDogInfoCreate);
    setShowAddSection(true);
  };

  const handleFinishAddDog = (dog: DogInfoCreate) => {
    setDogInfoCreate(defaultDogInfoCreate);
    setShowAddSection(false);
    const newDog = { ...dog, alive: true, uid: dog.uid ?? v4() };
    setDogs((prev) => [...prev, newDog]);
    const newDogItem = {
      dog: newDog,
      key: newDog.uid,
      label: newDog.dogName,
      children: (
        <div
          style={{ display: "flex", columnGap: "10px", alignItems: "center" }}
        >
          <p>{newDog.breedType}</p>
          {newDog.weight ? <p>{newDog.weight} kg</p> : null}
        </div>
      ),
      extra: (
        <Popconfirm
          title="删除狗狗"
          description="你确定要删除这个狗狗么?"
          onConfirm={(e) => {
            e?.stopPropagation();
            e?.preventDefault();
            handleRemoveDog({
              dog: newDog,
              key: newDog.uid,
              label: newDog.dogName,
            });
          }}
        >
          <DeleteOutlined />
        </Popconfirm>
      ),
    };
    updateDogList([...dogList, newDogItem]);
  };

  const handleRemoveDog = (dog: DogListInfo) => {
    setDogList((prevList) => {
      const newList = prevList.filter((d) => d.key !== dog.key);
      onSave(newList);
      return newList;
    });
  };

  return display == Display.FORM ? (
    "form"
  ) : display == Display.COLLAPSE ? (
    <>
      <Button onClick={handleAddDog}>添加狗狗</Button>

      {showAddSection ? <DogSectionForm onSave={handleFinishAddDog} /> : null}

      {dogList.length ? (
        <Collapse size="small" items={dogList} collapsible="header" />
      ) : null}
    </>
  ) : (
    <></>
  );
};

export default ModifyDogSection;
