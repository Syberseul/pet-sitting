import { Button, Form, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import ModifyDogSection from "./ModifyDogSection";
import { Display } from "@/enums";
import { DogInfoCreate, DogListInfo } from "@/Interface/dogInterface";

import type { FormInstance } from "antd";
import {
  CreateDogOwnerSuccessResponse,
  DogOwner,
  isCreateDogOwnerSuccess,
} from "@/Interface/dogOwnerInterface";
import { createDogOwner } from "@/APIs/dogOwnerApi";
import { useDispatch } from "react-redux";
import { modifyDogOwner } from "@/store/modules/dogOwnersStore";
import { useI18n } from "@/Context/languageContext";

interface Props {
  afterCreate: (ownerInfo: DogOwner) => void;
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

const CreateDogOwner: React.FC<Props> = ({ afterCreate }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [_dogs, setDogs] = useState<DogInfoCreate[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [modalKey, setModalKey] = useState(0);
  const [dogList, setDogList] = useState<DogListInfo[]>([]);

  const [form] = Form.useForm();

  const { t } = useI18n();

  const dispatch = useDispatch();

  const onFinish = async () => {
    try {
      await form.validateFields();

      const formValues = form.getFieldsValue();

      const addedDogs: DogInfoCreate[] = dogList.map((dog) => dog.dog);
      setDogs(addedDogs);

      const dogOwnerData: DogOwner = {
        name: formValues.userName,
        dogs: addedDogs,
        isFromWx: false,
        contactNo: formValues.contactNo ?? "",
      };

      setIsCreating(true);

      const res = await createDogOwner(dogOwnerData);

      setIsCreating(false);

      if (isCreateDogOwnerSuccess(res)) {
        const { data } = res as CreateDogOwnerSuccessResponse;
        afterCreate(data);

        dispatch(modifyDogOwner(data));
      }

      closeModal();
    } catch (error) {
      //   console.log(error);
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setDogList([]);
    form.setFieldsValue({
      userName: "",
      contactNo: "",
    });
    setModalKey((prev) => prev + 1);
  };

  const handleSaveDogs = (dogs: DogListInfo[]) => {
    setDogList(dogs);
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpenModal(true)}>
        {t.addDogOwner}
      </Button>

      <Modal
        title={<p>{t.ownerInfo + ":"}</p>}
        open={openModal}
        footer={
          <SubmitButton
            form={form}
            onSave={onFinish}
            dogList={dogList}
            isLoading={isCreating}
          >
            {t.submit}
          </SubmitButton>
        }
        onCancel={closeModal}
      >
        <Form
          form={form}
          layout="horizontal"
          style={{ maxWidth: 600 }}
          labelCol={{ span: 4 }}
          onFinish={onFinish}
          autoComplete="off"
          component={false}
        >
          <Form.Item
            label={t.name}
            name="userName"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={t.contactNo} name="contactNo">
            <Input />
          </Form.Item>

          <Form.Item label={t.dogInfo}>
            <ModifyDogSection
              key={modalKey}
              display={Display.COLLAPSE}
              onSave={handleSaveDogs}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateDogOwner;
