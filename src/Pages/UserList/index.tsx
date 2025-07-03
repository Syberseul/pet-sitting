import React, { useEffect, useState } from "react";

import {
  Button,
  Dropdown,
  Input,
  Modal,
  notification,
  Switch,
  Table,
  Tag,
} from "antd";

import type { MenuProps, TableColumnsType } from "antd";

import {
  getAllUsers,
  updateUserRole,
  updateUserReceiveNotification,
  updateUser,
} from "@/APIs/userApi";

import LoadingList from "@/Components/LoadingList";

import { UserRole } from "@/enums";

import { useI18n } from "@/Context/languageContext";

import {
  BugOutlined,
  CheckOutlined,
  LinkOutlined,
  SmileOutlined,
} from "@ant-design/icons";

import {
  isLinkUserSuccess,
  LinkUserErrorResponse,
} from "@/Interface/authInterface";

interface UserData {
  email: string;
  id: string;
  role: number | null;
  userName: string;
  validFcmTokens: number;
  receiveNotifications: boolean;
  dogOwnerRefNo?: string;
}

interface ListTableProps {
  data: UserData[];
}

function UserList() {
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [showChangeRolePopup, setShowChangeRolePopup] = useState(false);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [showLinkUserModal, setShowLinkUserModal] = useState(false);
  const [dogOwnerRefNo, setDogOwnerRefNo] = useState("");

  const [api, contextHolder] = notification.useNotification();

  const { t } = useI18n();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!showChangeRolePopup) {
      setSelectedRole(null);
      setSelectedUser(null);
      setIsUpdatingUser(false);
    }
  }, [showChangeRolePopup]);

  const loadUsers = async () => {
    setIsFetchingUsers(true);

    const response = await getAllUsers();

    if (response.error) console.error(response.error);
    else {
      console.log(response);
      setUsers(
        response.map((data: { id: any }) => ({
          ...data,
          key: data.id,
        }))
      );
    }

    setIsFetchingUsers(false);
  };

  const getRoleTag = (role: number, user: UserData) => {
    const _getRoleTagColor = (role: number) => {
      let color = "volcano";

      switch (role) {
        case 100:
          color = "green";
          break;
        case 90:
          color = "yellow";
          break;
        case 10:
          color = "lightblue";
          break;
        case 0:
        default:
          break;
      }

      return color;
    };

    const allRoles: number[] = Object.values(UserRole).filter(
      (r) => typeof r === "number"
    ) as number[];

    const RoleTag = ({ role }: { role: number }) => (
      <Tag
        color={_getRoleTagColor(role)}
        key={getRoleTagText(role)}
        style={{ width: "100%", textAlign: "center" }}
      >
        {getRoleTagText(role)}
      </Tag>
    );

    const items: MenuProps["items"] = allRoles
      .map((r: number) => ({
        label: <RoleTag role={r} />,
        key: r,
      }))
      .filter((r) => r.key != role);

    return (
      <Dropdown
        menu={{
          items,
          onClick: (menuInfo) => handleSelectRole(user, menuInfo),
        }}
        trigger={["click"]}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <RoleTag role={role} />
          </a>
          {role === UserRole.DOG_OWNER ? (
            user.dogOwnerRefNo ? (
              <Button type="link" disabled={true}>
                <div
                  style={{ display: "flex", columnGap: "5px", color: "green" }}
                >
                  <CheckOutlined />
                  <p>{t.userLinkedWithDogOwner}</p>
                </div>
              </Button>
            ) : (
              <Button
                type="link"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedUser(user);
                  setShowLinkUserModal(true);
                }}
                disabled={
                  isUpdatingUser && selectedUser! && selectedUser.id === user.id
                }
                loading={isUpdatingUser}
              >
                <div style={{ display: "flex", columnGap: "5px" }}>
                  {isUpdatingUser ? null : <LinkOutlined />}
                  <p>
                    {isUpdatingUser
                      ? t.linkingUserAndDogOwner
                      : t.linkUserAndDogOwner}
                  </p>
                </div>
              </Button>
            )
          ) : null}
        </div>
      </Dropdown>
    );
  };

  const getReceiveNotificationsToggle = (
    userReceiveNotification: boolean,
    user: UserData
  ) => {
    const isEditable = [UserRole.ADMIN, UserRole.DEVELOPER].includes(
      user.role!
    );

    return (
      <Switch
        disabled={!isEditable || isUpdatingUser}
        defaultChecked={userReceiveNotification}
        onChange={() => handleToggleUserReceiveNotification(user)}
        loading={
          isUpdatingUser && selectedUser != null && selectedUser.id == user.id
        }
      />
    );
  };

  const handleSelectRole = (user: UserData, menuInfo: { key: React.Key }) => {
    setShowChangeRolePopup(true);
    setSelectedRole(Number(menuInfo.key));
    setSelectedUser(user);
  };

  const handleLinkDogOwner = async () => {
    if (!selectedUser || isUpdatingUser || !dogOwnerRefNo) return;

    const linkedData = {
      ...selectedUser,
      dogOwnerRefNo,
    };

    setIsUpdatingUser(true);

    const response = await updateUser(linkedData);

    if (isLinkUserSuccess(response) && response.dogOwnerRefNo && response.uid) {
      const { uid, dogOwnerRefNo } = response;

      setUsers(
        users.map((u) => {
          if (u.id === uid) return { ...u, dogOwnerRefNo };
          return u;
        })
      );

      api.open({
        message: t.linkUserSuccessTitle,
        description: t.linkUserSuccessDescription,
        icon: <SmileOutlined style={{ color: "#0f96" }} />,
      });
    } else {
      const {
        details: { error },
      } = response as LinkUserErrorResponse;
      let errText = "";
      if (error.includes("Invalid dogOwnerRefNo"))
        errText = t.linkUserFailWithInvalidRef;
      else if (error.includes("already linked to"))
        errText = t.linkUserFailWithLinkedDogOwner;
      api.open({
        message: t.linkUserFailTitle,
        description: errText,
        icon: <BugOutlined style={{ color: "#f006" }} />,
      });
    }

    setIsUpdatingUser(false);
    setSelectedUser(null);
    setDogOwnerRefNo("");
    setShowLinkUserModal(false);
  };

  const handleToggleUserReceiveNotification = async (user: UserData) => {
    if (isUpdatingUser) return;

    setSelectedUser(user);
    setIsUpdatingUser(true);

    const response = await updateUserReceiveNotification(
      user.id,
      user.receiveNotifications ? 0 : 1
    );

    if (response?.status == 200) {
      const newUsers = users.map((usr: UserData) => {
        if (usr.id != user!.id) return usr;
        return {
          ...usr,
          receiveNotifications: !user.receiveNotifications,
        };
      });
      setUsers(newUsers);
    }

    setSelectedUser(null);
    setIsUpdatingUser(false);
  };

  const columns: TableColumnsType<UserData> = [
    {
      title: t.email,
      dataIndex: "email",
      key: "email",
      render: (text) => <a href={`mailto:${text}`}>{text}</a>,
    },
    {
      title: t.id,
      dataIndex: "id",
      key: "id",
    },
    {
      title: t.userName,
      dataIndex: "userName",
      key: "userName",
      render: (text) => <p>{text ? text : "-"}</p>,
    },
    {
      title: t.role,
      dataIndex: "role",
      key: "role",
      render: (text, record) => getRoleTag(text, record),
    },
    {
      title: t.mobileDevices,
      dataIndex: "validFcmTokens",
      key: "validFcmTokens",
    },
    {
      title: t.receiveNotifications,
      dataIndex: "receiveNotifications",
      key: "receiveNotifications",
      render: (text, record) => getReceiveNotificationsToggle(text, record),
    },
  ];

  const ListTable: React.FC<ListTableProps> = ({ data }) => {
    return (
      <Table<UserData>
        columns={columns}
        dataSource={data}
        scroll={{ y: "calc(100vh - 250px)" }}
      />
    );
  };

  const getRoleTagText = (role: number) => {
    let tag = t.visitor;

    switch (role) {
      case 100:
        tag = t.admin;
        break;
      case 90:
        tag = t.developer;
        break;
      case 10:
        tag = t.dogOwner;
        break;
      case 0:
      default:
        break;
    }

    return tag;
  };

  const handleConfirmChangeUserRole = async () => {
    if (!selectedUser) return;

    setIsUpdatingUser(true);

    const response = await updateUserRole(selectedUser!.id, selectedRole!);

    if (response?.status == 200) {
      const newUsers = users.map((user: UserData) => {
        if (user.id != selectedUser.id) return user;
        return { ...user, role: selectedRole };
      });
      setUsers(newUsers);
    }

    setShowChangeRolePopup(false);
  };

  return isFetchingUsers ? (
    <LoadingList />
  ) : (
    <>
      {contextHolder}
      <ListTable data={users} />
      <Modal
        title={t.editUserRole}
        closable={{ "aria-label": "Custom Close Button" }}
        open={showChangeRolePopup}
        onOk={handleConfirmChangeUserRole}
        onCancel={() => setShowChangeRolePopup(false)}
        okButtonProps={{
          loading: isUpdatingUser,
        }}
        cancelButtonProps={{
          loading: isUpdatingUser,
        }}
        cancelText={t.cancel}
        okText={t.ok}
      >
        <p>
          {t.confirmChangeRolePreText +
            " " +
            getRoleTagText(selectedUser?.role!) +
            " " +
            t.confirmChangeRoleMidText +
            " " +
            getRoleTagText(selectedRole!) +
            " " +
            t.confirmChangeRoleEndText}
        </p>

        <p>{t.confirmChangeRoleNoticeText}</p>
      </Modal>
      <Modal
        title={t.confirmLinkUserTitleText}
        open={showLinkUserModal}
        onOk={async () => await handleLinkDogOwner()}
        onCancel={() => {
          setShowLinkUserModal(false);
          setSelectedUser(null);
          setDogOwnerRefNo("");
        }}
        okText={t.ok}
        cancelText={t.cancel}
        loading={isUpdatingUser}
      >
        <h3>{t.linkDogOwnerPromptText}</h3>
        <Input
          placeholder={t.enterDogOwnerRefPlaceholderText}
          value={dogOwnerRefNo}
          onChange={(e) => setDogOwnerRefNo(e.target.value || "")}
        />
      </Modal>
      ;
    </>
  );
}

export default UserList;
