import { DogInfo } from "@/Interface/dogInterface";
import { Modal } from "antd";
import DogSectionForm from "./DogSectionForm";
import { DogOwner } from "@/Interface/dogOwnerInterface";

interface Props {
  isModalOpen: boolean;
  dogInfo: DogInfo;
  ownerInfo: DogOwner;
  afterModifyDogInfo: (dogInfo: DogInfo) => void;
  closeModal: () => void;
  isModifyingDog: boolean;
}

function ModifyDogModal(props: Props) {
  const {
    isModalOpen,
    dogInfo,
    ownerInfo,
    afterModifyDogInfo,
    closeModal,
    isModifyingDog,
  } = props;

  return isModalOpen ? (
    <Modal
      title={dogInfo.uid ? "修改狗狗信息" : "添加狗狗"}
      open={isModalOpen}
      footer={null}
      onCancel={closeModal}
    >
      <DogSectionForm
        onSave={(dogInfo) => afterModifyDogInfo(dogInfo! as DogInfo)}
        ownerId={ownerInfo.uid}
        uid={dogInfo.uid}
        dogInfo={dogInfo}
        isModifyingDog={isModifyingDog}
      />
    </Modal>
  ) : null;
}

export default ModifyDogModal;
