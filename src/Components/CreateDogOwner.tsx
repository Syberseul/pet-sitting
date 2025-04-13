import { Button, Form, Input, Modal } from "antd";
import React, { useState } from "react";
import ModifyDogSection from "./ModifyDogSection";
import { Display } from "@/enums";

interface Props {
  afterCreate: () => void;
}

const CreateDogOwner: React.FC<Props> = ({ afterCreate }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [form] = Form.useForm();

  const onFinish = async () => {
    try {
      await form.validateFields();

      //   setIsCreating(true);

      const formValues = form.getFieldsValue();

      console.log(formValues);
    } catch (error) {
      //   console.log(error);
    }
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpenModal(true)}>
        添加狗狗主人
      </Button>

      <Modal
        title={<p>主人信息：</p>}
        open={openModal}
        footer={
          <Button type="primary" onClick={onFinish} loading={isCreating}>
            提交
          </Button>
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

          <Form.Item label="狗狗信息" name="dogs">
            <ModifyDogSection
              display={Display.COLLAPSE}
              onSave={(dogs) => console.log(dogs)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateDogOwner;
