import { BreedInfo, DogInfo, DogInfoCreate } from "@/Interface/dogInterface";

import {
  DogStatus,
  getBreedInfo,
  transformBreedMapToTree,
} from "@/util/breedMap";

import {
  Alert,
  Button,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Popover,
  Radio,
  Space,
  TreeSelect,
} from "antd";

import { useEffect, useState } from "react";

interface FormProps {
  onSave: (dog: DogInfoCreate) => void;
  ownerId?: string;
  uid?: string;
  dogInfo?: DogInfo;
  isModifyingDog?: boolean;
}

const initialDogStatus: DogStatus = {
  isLoadingDogImg: false,
  imgUrl: "",
  showImg: false,
  isDogInWeightRange: true,
  isDogOverWeight: false,
};

const defaultBreedInfo: BreedInfo = {
  name: "",
  normalWeightRange: [0, 0],
};

const initCreateFormData = {
  breedType: "",
  breedName: "",
  dogName: "",
  uid: "",
  ownerId: "",
  weight: 0,
  sex: 0,
  desex: false,
  alive: true,
};

const DogSectionForm: React.FC<FormProps> = ({
  onSave,
  ownerId,
  uid,
  dogInfo,
  isModifyingDog,
}) => {
  const [modifyForm] = Form.useForm();

  const [breed, setBreed] = useState<BreedInfo>(defaultBreedInfo);
  const [dogStatus, setDogStatus] = useState<DogStatus>(initialDogStatus);
  const [isEdit, setIsEdit] = useState(false);
  const [initFormData, setInitFormData] = useState(initCreateFormData);

  const [isFetchingImg, setIsFetchingImg] = useState(false);

  useEffect(() => {
    initDogInfo();
  }, [dogInfo, modifyForm]);

  useEffect(() => {
    getDogInfo();
  }, [breed.name]);

  const initDogInfo = () => {
    if (!dogInfo || !dogInfo.uid) {
      setIsEdit(false);
      setInitFormData(initCreateFormData);
      modifyForm.resetFields();
      setBreed(defaultBreedInfo);
    } else {
      setIsEdit(true);
      onBreedChange(dogInfo.breedName);
      setInitFormData({
        dogName: dogInfo.dogName,
        uid: dogInfo.uid,
        ownerId: dogInfo.ownerId,
        weight: dogInfo.weight ?? 0,
        alive: true,
        breedType: dogInfo.breedType,
        breedName: dogInfo.breedName,
        sex: dogInfo.sex ?? 0,
        desex: dogInfo.desex ?? false,
      });
      modifyForm.setFieldsValue({
        dogName: dogInfo.dogName,
        breedType: dogInfo.breedType,
        weight: dogInfo.weight ?? 0,
        sex: dogInfo.sex ?? 0,
        desex: dogInfo.desex ?? false,
      });
      const breedInfo = getBreedInfo(dogInfo.breedName);
      if (breedInfo) {
        setBreed(breedInfo);
      }
    }
  };

  const onBreedChange = (newValue: string) => {
    setBreed({ ...breed, name: newValue });
  };

  const getDogInfo = async () => {
    if (!breed.name || isFetchingImg) return;

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
      setIsFetchingImg(true);
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
          isDogInWeightRange: weight
            ? weight >= minWeight && weight <= maxWeight
            : true,
          isDogOverWeight: weight > maxWeight,
        });
      }

      setIsFetchingImg(false);
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
      ownerId,
      uid,
      breedName: breed.searchName!,
    });
  };

  const handleEditDog = () => {
    const formData = modifyForm.getFieldsValue();

    onSave({
      ...dogInfo,
      ...formData,
      weight: formData.weight ?? 0,
      breedName: breed.searchName!,
    });
  };

  return (
    <>
      <Form
        form={modifyForm}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
        autoComplete="off"
        initialValues={initFormData}
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

        {!dogStatus.isDogInWeightRange || breed.size ? (
          <Form.Item label=" " colon={false} style={{ marginBottom: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              {!dogStatus.isDogInWeightRange && (
                <Alert
                  message={
                    dogStatus.isDogOverWeight ? "狗狗有些超重！" : "狗狗有些瘦"
                  }
                  type="warning"
                  showIcon
                  style={{ flex: "none", margin: 0 }}
                />
              )}
              {breed.size && (
                <Popover
                  title={breed.size}
                  content={`平均体重区间: ${breed.normalWeightRange.join(
                    "Kg ~ "
                  )}Kg`}
                >
                  <span>({breed.size})</span>
                </Popover>
              )}
            </div>
          </Form.Item>
        ) : null}

        <Form.Item label="性别" name="sex">
          <Radio.Group>
            <Radio.Button value={1}>Male</Radio.Button>
            <Radio.Button value={0}>Unknown</Radio.Button>
            <Radio.Button value={2}>Female</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="绝育状态" name="desex">
          <Radio.Group>
            <Radio.Button value={false}>未绝育</Radio.Button>
            <Radio.Button value={true}>已绝育</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          colon={false}
          style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}
        >
          <Space
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <SubmitButton
              form={modifyForm}
              onSave={() => {
                isEdit ? handleEditDog() : handleAddDog();
              }}
              isModifyingDog={isModifyingDog}
            >
              {isEdit ? "修改" : "添加"}
            </SubmitButton>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

interface SubmitButtonProps {
  form: FormInstance;
  onSave: () => void;
  isModifyingDog?: boolean;
}

const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({
  form,
  children,
  onSave,
  isModifyingDog,
}) => {
  const [submittable, setSubmittable] = useState<boolean>(false);

  // Watch all values
  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <Button
      type="primary"
      htmlType="submit"
      disabled={!submittable || isModifyingDog}
      onClick={onSave}
    >
      {children}
    </Button>
  );
};

export default DogSectionForm;
