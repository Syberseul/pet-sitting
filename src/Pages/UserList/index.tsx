import React, { useEffect, useState } from "react";

import { Dropdown, Modal, Switch, Table, Tag } from "antd";

import type { MenuProps, TableColumnsType } from "antd";

import {
  getAllUsers,
  updateUser,
  updateUserReceiveNotification,
} from "@/APIs/userApi";

import LoadingList from "@/Components/LoadingList";

import { UserRole } from "@/enums";

interface UserData {
  email: string;
  id: string;
  role: number | null;
  userName: string;
  validFcmTokens: number;
  receiveNotifications: boolean;
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
    else
      setUsers(
        response.map((data: { id: any }) => ({
          ...data,
          key: data.id,
        }))
      );

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
        <a onClick={(e) => e.preventDefault()}>
          <RoleTag role={role} />
        </a>
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
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <a href={`mailto:${text}`}>{text}</a>,
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "UserName",
      dataIndex: "userName",
      key: "userName",
      render: (text) => <p>{text ? text : "-"}</p>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text, record) => getRoleTag(text, record),
    },
    {
      title: "Mobile Devices",
      dataIndex: "validFcmTokens",
      key: "validFcmTokens",
    },
    {
      title: "Receive Notifications",
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
    let tag = "VISITOR";

    switch (role) {
      case 100:
        tag = "ADMIN";
        break;
      case 90:
        tag = "DEVELOPER";
        break;
      case 10:
        tag = "DOG OWNER";
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

    const response = await updateUser(selectedUser!.id, selectedRole!);

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
      <ListTable data={users} />
      <Modal
        title="修改用户身份"
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
      >
        <p>
          确定要将用户的身份从 {getRoleTagText(selectedUser?.role!)} 更改为{" "}
          {getRoleTagText(selectedRole!)} 吗？
        </p>

        <p>请注意：变更用户身份有可能会导致用户权限发生更改！</p>
      </Modal>
    </>
  );
}

export default UserList;
