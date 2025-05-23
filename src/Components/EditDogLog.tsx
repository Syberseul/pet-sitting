import React, { useEffect, useState } from "react";

import { getDogLog, updateDogLog } from "@/APIs/dogApi";

import {
  getBreedInfo,
  DogStatus,
  transformBreedMapToTree,
} from "@/util/breedMap";

import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Popover,
  Typography,
  TreeSelect,
  Skeleton,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import dayjs from "dayjs";

import type { GetProps } from "antd";

import {
  BreedInfo,
  DogFormDetails,
  isCreateLogSuccess,
  NoteDetails,
} from "@/Interface/dogInterface";

const { RangePicker } = DatePicker;

type SizeType = Parameters<typeof Form>[0]["size"];
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const initialDogStatus: DogStatus = {
  isLoadingDogImg: false,
  imgUrl: "",
  showImg: false,
  isDogInWeightRange: true,
  isDogOverWeight: false,
};

const initNoteDetails: NoteDetails = {
  showAddNoteModal: false,
  content: "",
  isEdit: false,
  editIndex: 0,
};

interface EditDogLogModalProps {
  uid: string;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditDogLogModal: React.FC<EditDogLogModalProps> = ({
  uid,
  visible,
  onCancel,
  onSuccess,
}) => {
  const [breed, setBreed] = useState<BreedInfo>({
    name: "",
    normalWeightRange: [0, 0],
  });
  const [dogStatus, setDogStatus] = useState<DogStatus>(initialDogStatus);
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );
  const [dateRange, setDateRange] = useState<[string, string] | null>();
  const [noteDetails, setNoteDetails] = useState<NoteDetails>(initNoteDetails);
  const [noteLists, setNoteLists] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [form] = Form.useForm();

  // 获取狗狗日志数据
  useEffect(() => {
    if (!uid || !visible) return;

    fetchDogDetails();
  }, [uid, visible]);

  const fetchDogDetails = async () => {
    setIsFetching(true);
    try {
      const res = await getDogLog(uid);
      handleDetails(res);
    } catch (error) {
      console.error("Failed to fetch dog log:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleDetails = async (res: any) => {
    form.resetFields();
    // 设置表单值
    await form.setFieldsValue({
      breedType: res.breedType,
      dogName: res.dogName,
      dateRange: [dayjs(res.startDate), dayjs(res.endDate)],
      weight: res.weight,
      dailyPrice: res.dailyPrice,
      ownerName: res.ownerName,
      contactNo: res.contactNo,
    });

    // 设置其他状态
    setNoteLists(res.notes || []);
    setDateRange([res.startDate, res.endDate]);

    // 设置品种信息
    const breedInfo = getBreedInfo(res.breedType);
    if (breedInfo) {
      setBreed({
        name: res.breedType,
        searchName: breedInfo.searchName,
        normalWeightRange: breedInfo.normalWeightRange,
        size: breedInfo.size,
      });
    }

    // 检查体重状态
    handleAfterWeightChange(res.weight);
  };

  const treeData = transformBreedMapToTree();

  const onFinish = async () => {
    try {
      setIsSaving(true);

      const values = await form.validateFields();

      const formData: DogFormDetails = {
        ...values,
        startDate: dateRange![0],
        endDate: dateRange![1],
        breedName: getBreedInfo(values.breedType)?.searchName,
        notes: noteLists,
      };
      const res = await updateDogLog({
        ...formData,
        dogLogId: uid,
      });

      isCreateLogSuccess(res) && onSuccess();

      setIsSaving(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return false;
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
  };

  useEffect(() => {
    getDogInfo();
  }, [breed.name]);

  const onChange = async (newValue: string) => {
    setBreed({ ...breed, name: newValue });
  };

  const getDogInfo = async () => {
    if (!breed.name) return;

    setDogStatus({
      ...initialDogStatus,
      isLoadingDogImg: true,
    });

    const breedInfo = getBreedInfo(breed.name);

    if (!breedInfo) {
      setDogStatus(initialDogStatus);
      return;
    }

    if (breedInfo.price) {
      form.setFieldsValue({
        dailyPrice: breedInfo.price,
      });
    }

    setBreed(breedInfo);

    if (breedInfo.searchName) {
      const res = await fetch(
        `https://dog.ceo/api/breed/${breedInfo?.searchName.replace(
          " ",
          "/"
        )}/images/random`
      );
      const data = await res.json();

      setDogStatus({
        ...initialDogStatus,
        isLoadingDogImg: false,
      });

      if (data.status == "success" && data.message) {
        setDogStatus({
          ...dogStatus,
          showImg: true,
          imgUrl: data.message,
        });
      }
    } else {
      setDogStatus(initialDogStatus);
      return;
    }
  };

  const handleDateRangeSelect: RangePickerProps["onChange"] = (
    dates,
    dateStrings
  ) => {
    console.log("dates: ", dates);
    setDateRange(dateStrings);

    // from dates => dateStrings
    // const formateedDates =
    //   dates?.map((date) => date?.format("YYYY-MM-DD")) || [];

    // from dateStrings => dates
    // const dateRangeStrings = [
    //   dateStrings[0] ? dayjs(dateStrings[0]) : null,
    //   dateStrings[1] ? dayjs(dateStrings[1]) : null,
    // ];
  };

  const handleAfterWeightChange = (val: number | null) => {
    console.log(val, breed.normalWeightRange);
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

  const handleAddNote = () => {
    if (!noteDetails.content) handleCloseAddNoteModal();

    if (!noteDetails.isEdit) setNoteLists([...noteLists, noteDetails.content]);
    else {
      const modifiedList = noteLists.map((note, index) => {
        if (noteDetails.editIndex == index) return noteDetails.content;
        return note;
      });
      setNoteLists(modifiedList);
    }

    handleCloseAddNoteModal();
  };

  const handleEditNote = (index: number) => {
    const note = noteLists[index];
    setNoteDetails({
      showAddNoteModal: true,
      content: note,
      isEdit: true,
      editIndex: index,
    });
  };

  const handleRemoveNote = (index: number) => {
    const modifiedList = noteLists.filter((_node, idx) => index != idx);
    setNoteLists(modifiedList);
  };

  const handleCloseAddNoteModal = () => {
    setNoteDetails(initNoteDetails);
    setDogStatus(initialDogStatus);
  };

  return (
    <Modal
      title="编辑寄养信息"
      open={visible}
      onCancel={onCancel}
      confirmLoading={isSaving}
      footer={[
        <Button key="back" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isSaving || isFetching}
          onClick={onFinish}
        >
          保存
        </Button>,
      ]}
      width={800}
    >
      {isFetching ? (
        <Skeleton active />
      ) : (
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          initialValues={{ size: componentSize }}
          onValuesChange={({ size }) => setComponentSize(size)}
          size={componentSize as SizeType}
          style={{ maxWidth: 600 }}
          autoComplete="off"
        >
          <Form.Item
            label="犬种"
            name="breedType"
            rules={[{ required: true, message: "请选择犬种" }]}
          >
            <TreeSelect
              showSearch
              style={{ width: "100%" }}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              placeholder="选择犬种"
              allowClear
              treeDefaultExpandAll
              onChange={onChange}
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
          <Form.Item
            label="接送时间"
            name="dateRange"
            rules={[{ required: true, message: "请选择接送时间" }]}
          >
            <RangePicker
              disabledDate={disabledDate}
              onChange={handleDateRangeSelect}
              placeholder={["起始时间", "结束时间"]}
            />
          </Form.Item>
          <Form.Item label="体重">
            <div
              style={{
                display: "flex",
                columnGap: "5px",
                alignItems: "center",
              }}
            >
              <Form.Item name="weight" noStyle>
                <InputNumber min={0} onChange={handleAfterWeightChange} />
              </Form.Item>
              <span>Kg</span>
              {!dogStatus.isDogInWeightRange && (
                <Alert
                  message={
                    dogStatus.isDogOverWeight ? "狗狗有些超重！" : "狗狗有些瘦"
                  }
                  type="warning"
                  showIcon
                />
              )}
            </div>
          </Form.Item>
          <Form.Item label="价格/天">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Form.Item name="dailyPrice" noStyle>
                <InputNumber min={0} />
              </Form.Item>
              {breed.size && (
                <Popover
                  title={breed.size}
                  content={`平均体重区间: ${breed.normalWeightRange.join(
                    "Kg ~ "
                  )}Kg`}
                >
                  <span style={{ marginLeft: 8 }}>({breed.size})</span>
                </Popover>
              )}
            </div>
          </Form.Item>
          <Form.Item label="主人名字" name="ownerName">
            <Input />
          </Form.Item>
          <Form.Item label="联系电话" name="contactNo">
            <Input />
          </Form.Item>

          {/* 注意事项列表 */}
          <Form.Item label="注意事项">
            <Button
              onClick={() =>
                setNoteDetails({ ...initNoteDetails, showAddNoteModal: true })
              }
            >
              添加笔记
            </Button>
          </Form.Item>

          {noteLists?.length > 0 && (
            <Form.Item label=" " colon={false}>
              <List
                bordered
                dataSource={noteLists}
                renderItem={(item, index) => (
                  <List.Item
                    actions={[
                      <EditOutlined
                        key="edit"
                        onClick={() => handleEditNote(index)}
                      />,
                      <DeleteOutlined
                        key="delete"
                        onClick={() => handleRemoveNote(index)}
                      />,
                    ]}
                  >
                    <Typography.Text mark>{index + 1}.</Typography.Text> {item}
                  </List.Item>
                )}
              />
            </Form.Item>
          )}
        </Form>
      )}

      {/* 添加笔记模态框 */}
      <Modal
        title="添加笔记"
        open={noteDetails.showAddNoteModal}
        onOk={handleAddNote}
        onCancel={() => setNoteDetails(initNoteDetails)}
      >
        <Input
          placeholder="笔记内容"
          value={noteDetails.content}
          onChange={(e) =>
            setNoteDetails({ ...noteDetails, content: e.target.value })
          }
        />
      </Modal>
    </Modal>
  );
};

export default EditDogLogModal;
