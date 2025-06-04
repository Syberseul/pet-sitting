import { DogInfoCreate, DogListInfo } from "@/Interface/dogInterface";
import {
  CreateDogOwnerSuccessResponse,
  DogOwner,
  isCreateDogOwnerSuccess,
} from "@/Interface/dogOwnerInterface";
import { Button, Form, FormInstance, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import ModifyDogSection from "./ModifyDogSection";
import { Display } from "@/enums";
import { updateDogOwner } from "@/APIs/dogOwnerApi";
import { useDispatch } from "react-redux";
import { modifyDogOwner } from "@/store/modules/dogOwnersStore";

interface Props {
  isModalOpen: boolean;
  ownerInfo: DogOwner;
  afterEdit: (ownerInfo: DogOwner) => void;
  closeModal: () => void;
}

interface SubmitButtonProps {
  form: FormInstance;
  onSave: () => void;
  dogList: DogListInfo[];
  isLoading: boolean;
}

const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({
  form,
  children,
  onSave,
  dogList,
  isLoading,
}) => {
  const [submittable, setSubmittable] = React.useState<boolean>(false);

  // Watch all values
  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(dogList.length > 0))
      .catch(() => setSubmittable(false));
  }, [form, values, dogList]);

  return (
    <Button
      type="primary"
      htmlType="submit"
      disabled={!submittable}
      onClick={onSave}
      loading={isLoading}
    >
      {children}
    </Button>
  );
};

function EditDogOwner(props: Props) {
  const { isModalOpen, ownerInfo, afterEdit, closeModal } = props;

  const [dogsList, setDogsList] = useState<DogListInfo[]>([]);
  const [modalKey, setModalKey] = useState(0);
  const [dataInit, setDataInit] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  useEffect(() => {
    initData();
  }, [isModalOpen]);

  const initData = () => {
    if (!isModalOpen) return;

    const dogs = ownerInfo?.dogs ?? [];
    const dogListInfo: DogListInfo[] = dogs.map((dog) => ({
      dog,
      key: dog.uid,
      label: dog.dogName,
    })) as DogListInfo[];

    setDogsList(dogListInfo);
    setDataInit(true);
  };

  const closeEditModal = () => {
    closeModal();
    setModalKey((prev) => prev + 1);
  };

  const handleSaveDogs = (dogs: DogListInfo[]) => {
    setDogsList(dogs);
  };

  const handleUpdateDogOwner = async () => {
    try {
      await form.validateFields();

      const formValues = form.getFieldsValue();

      const addedDogs: DogInfoCreate[] = dogsList.map((dog) => dog.dog);

      const dogOwnerData: DogOwner = {
        ...ownerInfo,
        name: formValues.userName,
        dogs: addedDogs,
        contactNo: formValues.contactNo ?? "",
      };

      setIsUpdating(true);

      const res = await updateDogOwner(dogOwnerData);

      setIsUpdating(false);

      if (isCreateDogOwnerSuccess(res)) {
        const { data } = res as CreateDogOwnerSuccessResponse;
        afterEdit(data);

        dispatch(modifyDogOwner(data));
      }

      closeEditModal();
    } catch (error) {
      //   console.log(error);
    }
  };

  return (
    <Modal
      title={<p>主人信息：</p>}
      open={isModalOpen}
      onCancel={closeEditModal}
      footer={
        <SubmitButton
          form={form}
          onSave={handleUpdateDogOwner}
          dogList={dogsList}
          isLoading={isUpdating}
        >
          更新
        </SubmitButton>
      }
    >
      <Form
        form={form}
        layout="horizontal"
        style={{ maxWidth: 600 }}
        labelCol={{ span: 4 }}
        autoComplete="off"
        component={false}
        initialValues={{
          userName: ownerInfo.name,
          contactNo: ownerInfo.contactNo,
        }}
      >
        <Form.Item
          label="姓名"
          name="userName"
          rules={[{ required: true, message: "请输入姓名" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="联系方式" name="contactNo">
          <Input />
        </Form.Item>

        <Form.Item label="狗狗信息">
          {dataInit ? (
            <ModifyDogSection
              key={modalKey}
              display={Display.COLLAPSE}
              onSave={handleSaveDogs}
              addedDogList={dogsList}
            />
          ) : (
            <></>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditDogOwner;
