import React, { useEffect, useState } from "react";

import { Display } from "@/enums";

import {  BreedInfo, DogInfoCreate, DogListInfo } from "@/Interface/dogInterface";

import { DogStatus, getBreedInfo, transformBreedMapToTree } from "@/util/breedMap";

import { Alert, Button, Collapse, Form, Input, InputNumber, Popconfirm, Popover, Space, TreeSelect } from "antd";

import { v4 } from "uuid";

interface Props {
  display: Display;
  onSave: (dogs: DogListInfo[]) => void;
}

const defaultDogInfoCreate: DogInfoCreate = {
  breedType: "",
  breedName: "",
  dogName: "",
  weight: 0,
  alive: true,
}

interface FormProps {
  onSave: (dog: DogInfoCreate) => void;
  ownerId?: string;
  uid?: string
}

const initialDogStatus: DogStatus = {
  isLoadingDogImg: false,
  imgUrl: "",
  showImg: false,
  isDogInWeightRange: true,
  isDogOverWeight: false,
};

import type { FormInstance } from 'antd';
import { DeleteOutlined } from "@ant-design/icons";

interface SubmitButtonProps {
  form: FormInstance;
  onSave: () => void;
}

const defaultBreedInfo: BreedInfo = {
  name: "",
  normalWeightRange: [0, 0],
}

const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({ form, children, onSave}) => {
  const [submittable, setSubmittable] = React.useState<boolean>(false);

  // Watch all values
  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <Button type="primary" htmlType="submit" disabled={!submittable} onClick={onSave}>
      {children}
    </Button>
  );
};

const DogSectionForm: React.FC<FormProps> = ({onSave, ownerId, uid}) => {
  const [modifyForm] = Form.useForm();

  const [breed, setBreed] = useState<BreedInfo>(defaultBreedInfo);

  const [dogStatus, setDogStatus] = useState<DogStatus>(initialDogStatus);

  useEffect(() => {
      getDogInfo();
    }, [breed.name]);

  const onBreedChange = (newValue: string) => {
    setBreed({ ...breed, name: newValue });
  };

   const getDogInfo = async () => {
      if (!breed.name) return;
  
      setDogStatus({
        ...initialDogStatus,
        isLoadingDogImg: true,
        isDogInWeightRange: true,
      });
  
      const breedInfo = getBreedInfo(breed.name);
  
      if (!breedInfo) {
        setDogStatus(initialDogStatus);
        return;
      }
  
      setBreed(breedInfo);
      
      const weight = modifyForm.getFieldValue("weight") ?? 0;

      const [minWeight, maxWeight] = breedInfo.normalWeightRange;
  
      if (breedInfo.searchName) {
        const res = await fetch(
          `https://dog.ceo/api/breed/${breedInfo.searchName.replace(
            " ",
            "/"
          )}/images/random`
        );
        const data = await res.json();
  
        setDogStatus({
          ...dogStatus,
          isLoadingDogImg: false,
        });
  
        if (data.status == "success" && data.message) {
          setDogStatus({
            ...dogStatus,
            showImg: true,
            imgUrl: data.message,
            isDogInWeightRange: weight ? weight >= minWeight && weight <= maxWeight : true,
            isDogOverWeight: weight > maxWeight,
          });
        }
      } else {
        setDogStatus(initialDogStatus);
        return;
      }
    };

  const treeData = transformBreedMapToTree();

  const handleAfterWeightChange = (val: number | null) => {
    if (!val) return;

    const { normalWeightRange } = breed;

    const [minWeight, maxWeight] = normalWeightRange;

    if (!minWeight || !maxWeight) return;

    if (val < minWeight || val > maxWeight) {
      setDogStatus({
        ...dogStatus,
        isDogInWeightRange: false,
        isDogOverWeight: val > maxWeight,
      });
    } else
      setDogStatus({
        ...dogStatus,
        isDogInWeightRange: true,
        isDogOverWeight: false,
      });
  };

  const handleAddDog = () => {
    const formData = modifyForm.getFieldsValue();
    onSave({
      ...formData,
      weight: formData.weight ?? 0,
      ownerId: ownerId,
      uid: uid,
      breedName: breed.searchName!,
    });
  }

  return <>
     <Form
          form={modifyForm}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
          autoComplete="off"
        >
          <Form.Item
            label="犬种"
            name="breedType"
            rules={[{ required: true, message: "请选择犬种" }]}
          >
            <TreeSelect
              showSearch
              style={{ width: "100%" }}
              value={breed.name}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              placeholder="选择犬种"
              allowClear
              treeDefaultExpandAll
              onChange={onBreedChange}
              treeData={treeData}
            />
          </Form.Item>
          {dogStatus.showImg && (
            <Form.Item
              style={{
                display: "flex",
                flexDirection: "column",
              }}
              label=" "
              colon={false}
            >
              <img
                src={dogStatus.imgUrl}
                alt={`${breed.name}`}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  maxHeight: "500px",
                  paddingTop: "10px",
                }}
              />
              <Button onClick={getDogInfo}>看其他</Button>
            </Form.Item>
          )}
          <Form.Item
            label="狗狗名字"
            name="dogName"
            rules={[{ required: true, message: "请输入狗狗的名字!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="体重">
            <div
              style={{
                display: "flex",
                columnGap: "5px",
                alignItems: "center",
              }}
            >
              <Form.Item
                name="weight"
                noStyle
                rules={[
                  {
                    type: "number",
                    min: 0,
                    message: "请输入有效的体重值",
                  },
                ]}
              >
                <InputNumber min={0} onChange={handleAfterWeightChange} />
              </Form.Item>
              <span>Kg</span>
            </div>
          </Form.Item>

          {(!dogStatus.isDogInWeightRange || breed.size) ? <Form.Item label=" " colon={false} style={{ marginBottom: 0 }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center",
              gap: 10,
            }}>
              {!dogStatus.isDogInWeightRange && (
                <Alert
                  message={dogStatus.isDogOverWeight ? "狗狗有些超重！" : "狗狗有些瘦"}
                  type="warning"
                  showIcon
                  style={{ flex: "none", margin: 0 }}
                />
              )}
              {breed.size && (
                <Popover
                  title={breed.size}
                  content={`平均体重区间: ${breed.normalWeightRange.join("Kg ~ ")}Kg`}
                >
                  <span>({breed.size})</span>
                </Popover>
              )}
            </div>
          </Form.Item> : null}

          <Form.Item colon={false} style={{display: "flex", width: "100%", justifyContent: "flex-end"}}>
            <Space style={{width: "100%", display: "flex", justifyContent: "flex-end"}}>
              <SubmitButton form={modifyForm} onSave={handleAddDog}>添加</SubmitButton>
            </Space>
          </Form.Item>
        </Form>
  </>
}

const ModifyDogSection: React.FC<Props> = ({ display, onSave }) => {
  const [_dogs, setDogs] = useState<DogInfoCreate[]>([]);
  const [dogList, setDogList] = useState<DogListInfo[]>([]);
  const [showAddSection, setShowAddSection] = useState<boolean>(false);
  const [_dogInfoCreate, setDogInfoCreate] = useState<DogInfoCreate>(defaultDogInfoCreate);

  const updateDogList = (newList: DogListInfo[]) => {
    setDogList(newList);
    onSave(newList); // 每次更新都通知父组件
  };

  const handleAddDog = () => {
    setDogInfoCreate(defaultDogInfoCreate);
    setShowAddSection(true);
  }

  const handleFinishAddDog = (dog:DogInfoCreate) => {
    setDogInfoCreate(defaultDogInfoCreate);
    setShowAddSection(false);
    const newDog = { ...dog, alive: true };
    setDogs(prev => [...prev, newDog]);
    const newDogItem = {
      dog: newDog,
      key: newDog.uid ? newDog.uid : v4(),
      label: newDog.dogName,
      children: <div style={{display: "flex", columnGap: "10px", alignItems: "center"}}>
      <p>{newDog.breedType}</p>
      {newDog.weight ? <p>{newDog.weight} kg</p> : null}
      </div>,
      extra: 
      <Popconfirm
        title="删除狗狗"
        description="你确定要删除这个狗狗么?"
        onConfirm={(e) => {
          e?.stopPropagation();
          e?.preventDefault();
          handleRemoveDog({
            dog: newDog,
            key: newDog.uid ? newDog.uid : v4(),
            label: newDog.dogName,
          })
        }}
      >
        <DeleteOutlined/>
      </Popconfirm>
    }
    updateDogList([...dogList, newDogItem]);
  }

  const handleRemoveDog = (dog: DogListInfo) => {
    const newDogList = dogList.filter(d => d.key !== dog.key);
    updateDogList(newDogList);
  }

  return display == Display.FORM ? (
    // <DogSectionForm onSave={onSave} />
    "form"
  ) : display == Display.COLLAPSE ? (
    // <Button onClick={() => onSave(dogs)}>save</Button>
    <>
    <Button onClick={handleAddDog}>添加狗狗</Button>

    {showAddSection ? <DogSectionForm onSave={handleFinishAddDog} /> : null}

    {dogList.length  ? <Collapse
      size="small"
      items={dogList}
      collapsible="header"
    /> : null}
    </>
  ) : (
    <></>
  );
};

export default ModifyDogSection;