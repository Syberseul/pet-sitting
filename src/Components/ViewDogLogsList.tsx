import { DailyDataStructure } from "@/Interface/dashboardInterface";
import { Button, Modal } from "antd";
import { useState } from "react";
import CollapseList from "./CollapseList";
import { useI18n } from "@/Context/languageContext";

interface Props {
  data: DailyDataStructure;
  afterModify: () => void;
}

function ViewDogLogsList(props: Props) {
  const { data, afterModify } = props;

  const { t } = useI18n();

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
        {t.view}
      </Button>
      <Modal
        title={t.details}
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
