import { DailyDataStructure } from "@/Interface/dashboardInterface";
import { Button, Modal } from "antd";
import { useState } from "react";
import CollapseList from "./CollapseList";

interface Props {
  data: DailyDataStructure;
  afterModify: () => void;
}

function ViewDogLogsList(props: Props) {
  const { data, afterModify } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" size="small" onClick={showModal}>
        查看
      </Button>
      <Modal
        title="详情"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <CollapseList data={data} afterModify={afterModify} />
      </Modal>
    </>
  );
}

export default ViewDogLogsList;
