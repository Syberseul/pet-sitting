import { DogInfo } from "@/Interface/dogInterface";
import { Modal } from "antd";
import DogSectionForm from "./DogSectionForm";
import { DogOwner } from "@/Interface/dogOwnerInterface";
import { useI18n } from "@/Context/languageContext";

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

  const { t } = useI18n();

  return isModalOpen ? (
    <Modal
      title={dogInfo.uid ? t.editDog : t.addDog}
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
