import EditDogLog from "@/Components/EditDogLog";
import { Button } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";

const Details: React.FC = () => {
  const props = useParams();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentUid, setCurrentUid] = useState("");

  const handleEdit = (uid: string) => {
    setCurrentUid(uid);
    setEditModalVisible(true);
  };

  return (
    <>
      <Button onClick={() => handleEdit(props.id!)}>编辑</Button>

      <EditDogLog
        uid={currentUid}
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onSuccess={() => {
          setEditModalVisible(false);
          // 可以在这里添加成功后的回调，如刷新列表
        }}
      />
    </>
  );
};

export default Details;
