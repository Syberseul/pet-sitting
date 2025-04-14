import { Button, Form, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import ModifyDogSection from "./ModifyDogSection";
import { Display } from "@/enums";
import { DogInfoCreate, DogListInfo } from "@/Interface/dogInterface";

import type { FormInstance } from 'antd';
import { DogOwner, isCreateDogOwnerSuccess } from "@/Interface/dogOwnerInterface";
import { createDogOwner } from "@/APIs/dogOwnerApi";

interface Props {
  afterCreate: () => void;
}

interface SubmitButtonProps {
  form: FormInstance;
  onSave: () => void;
  dogList: DogListInfo[];
  isLoading: boolean;
}

const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({ form, children, onSave, dogList, isLoading}) => {
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
    <Button type="primary" htmlType="submit" disabled={!submittable} onClick={onSave} loading={isLoading}>
      {children}
    </Button>
  );
};

const CreateDogOwner: React.FC<Props> = ({ afterCreate }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [_dogs, setDogs] = useState<DogInfoCreate[]>([])
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [modalKey, setModalKey] = useState(0);
  const [dogList, setDogList] = useState<DogListInfo[]>([])


  const [form] = Form.useForm();

  const onFinish = async () => {
    try {
      await form.validateFields();

      //   setIsCreating(true);

      const formValues = form.getFieldsValue();
      
      const addedDogs: DogInfoCreate[] = dogList.map((dog) => (dog.dog));
      setDogs(addedDogs);

      const dogOwnerData: DogOwner = {
        name: formValues.userName,
        dogs: addedDogs,
        isFromWx: false,
        contactNo: formValues.contactNo ?? ""
      }

      setIsCreating(true);

      const res = await createDogOwner(dogOwnerData);

      setIsCreating(false);

      if (isCreateDogOwnerSuccess(res)) afterCreate();
      
      closeModal()
    } catch (error) {
      //   console.log(error);
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setDogList([]);
    form.setFieldsValue({
      userName: "",
      contactNo: ""
    })
    setModalKey(prev => prev + 1);
  };

  const handleSaveDogs = (dogs: DogListInfo[]) => {
    setDogList(dogs);
  }

  return (
    <>
      <Button type="primary" onClick={() => setOpenModal(true)}>
        添加狗狗主人
      </Button>

      <Modal
        title={<p>主人信息：</p>}
        open={openModal}
        footer={
          <SubmitButton form={form} onSave={onFinish} dogList={dogList} isLoading={isCreating}>提交</SubmitButton>
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
