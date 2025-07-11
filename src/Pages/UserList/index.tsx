import React, { useEffect, useRef, useState } from "react";

import {
  Button,
  Divider,
  Dropdown,
  Input,
  Modal,
  notification,
  Popconfirm,
  Select,
  Switch,
  Table,
  Tag,
} from "antd";

import type { InputRef, MenuProps, TableColumnsType } from "antd";

import {
  getAllUsers,
  updateUserRole,
  updateUserReceiveNotification,
  updateUser,
  disconnectUserAndDogOwner,
} from "@/APIs/userApi";

import LoadingList from "@/Components/LoadingList";

import { UserRole } from "@/enums";

import { useI18n } from "@/Context/languageContext";

import {
  BugOutlined,
  CheckOutlined,
  DisconnectOutlined,
  LinkOutlined,
  LoadingOutlined,
  SmileOutlined,
} from "@ant-design/icons";

import {
  isLinkUserSuccess,
  LinkUserErrorResponse,
} from "@/Interface/authInterface";

import "./index.css";
import { isUserUpdateSuccess } from "@/Interface/userInterface";
import {
  DogOwner,
  getDogOwnersSuccess,
  isGetDogOwnerSuccess,
} from "@/Interface/dogOwnerInterface";
import { getDogOwners } from "@/APIs/dogOwnerApi";
import CreateDogOwner from "@/Components/CreateDogOwner";

interface UserData {
  email: string;
  id: string;
  role: number | null;
  userName: string;
  validFcmTokens: number;
  receiveNotifications: boolean;
  dogOwnerRefNo?: string;
  updating: boolean;
}

interface ListTableProps {
  data: UserData[];
}

interface DogOwnerInfo extends DogOwner {
  value: string;
  label: string;
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
  const [dogOwners, setDogOwners] = useState<DogOwnerInfo[]>([]);
  const [isLoadingDogOwners, setIsLoadingDogOwners] = useState(false);
  const [dogOwnerFetched, setDogOwnerFetched] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const { t } = useI18n();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!showChangeRolePopup) resetUpdateUserInfo();
  }, [showChangeRolePopup]);

  useEffect(() => {
    if (showLinkUserModal && dogOwnerInputRef.current) {
      const timer = setTimeout(() => {
        dogOwnerInputRef.current!.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showLinkUserModal]);

  const dogOwnerInputRef = useRef<InputRef>(null);

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
              <div style={{ position: "relative", display: "inline-block" }}>
                <Button
                  type="link"
                  className="icon-text-swap-button"
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    padding: "4px 8px",
                    width: "100%",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      columnGap: "5px",
                      position: "relative",
                    }}
                  >
                    {/* Default icon & text */}
                    {user.updating ? (
                      <LoadingOutlined className="default-icon" />
                    ) : (
                      <CheckOutlined className="default-icon" />
                    )}
                    <span className="default-text">
                      {user.updating ? t.updating : t.userLinkedWithDogOwner}
                    </span>

                    {/* Hover icon & text */}
                    {user.updating ? (
                      <LoadingOutlined
                        className="hover-icon"
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    ) : (
                      <DisconnectOutlined
                        className="hover-icon"
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                    <Popconfirm
                      title={t.disconnectDogOwnerPrompt}
                      description={`${t.confirmDisconnectDogOwnerPromptText}?`}
                      onConfirm={async (e) => {
                        e?.stopPropagation();
                        await handleDisconnectUserAndDogOwner(user);
                      }}
                      okText={t.disconnect}
                      okType="danger"
                      cancelText={t.notNow}
                      disabled={user.updating}
                    >
                      <span
                        className="hover-text"
                        style={{
                          position: "absolute",
                          left: "24px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        {user.updating
                          ? t.updating
                          : t.disconnectWithDogOwnerText}
                      </span>
                    </Popconfirm>
                  </div>
                </Button>
              </div>
            ) : (
              <Button
                type="link"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedUser(user);
                  setShowLinkUserModal(true);
                }}
                disabled={selectedUser?.id === user.id}
                loading={user.updating}
              >
                <div style={{ display: "flex", columnGap: "5px" }}>
                  {user.updating ? null : <LinkOutlined />}
                  <p>
                    {user.updating
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

  const handleSelectRole = async (
    user: UserData,
    menuInfo: { key: React.Key }
  ) => {
    const selectedRole = Number(menuInfo.key);
    setShowChangeRolePopup(true);
    setSelectedRole(selectedRole);
    setSelectedUser(user);

    if (
      selectedRole === UserRole.DOG_OWNER &&
      user.role === UserRole.VISITOR &&
      !dogOwnerFetched
    ) {
      setIsLoadingDogOwners(true);

      const response = await getDogOwners();

      if (isGetDogOwnerSuccess(response)) {
        setDogOwnerFetched(true);
        const { data } = response as getDogOwnersSuccess;
        setDogOwners(
          data
            .filter((d) => !d.linkedDogOwner)
            .map((d) => ({
              ...d,
              value: d.uid!,
              label: d.name ?? "Unknown",
            }))
        );
      }

      setIsLoadingDogOwners(false);
    }
  };

  const handleLinkDogOwner = async () => {
    if (!selectedUser || isUpdatingUser || !dogOwnerRefNo) return;

    const linkedData = {
      ...selectedUser,
      dogOwnerRefNo,
    };

    setIsUpdatingUser(true);
    setUsers(
      users.map((u) => {
        if (u.id === selectedUser.id)
          return { ...u, dogOwnerRefNo, updating: true };
        return u;
      })
    );

    const response = await updateUser(linkedData);

    if (isLinkUserSuccess(response) && response.dogOwnerRefNo && response.uid) {
      const { uid, dogOwnerRefNo } = response;

      setUsers(
        users.map((u) => {
          if (u.id === uid) return { ...u, dogOwnerRefNo, updating: false };
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
      setUsers(users.map((u) => ({ ...u, updating: false })));
    }

    setIsUpdatingUser(false);
    setSelectedUser(null);
    setDogOwnerRefNo("");
    setShowLinkUserModal(false);
  };

  const handleDisconnectUserAndDogOwner = async (user: UserData) => {
    if (isUpdatingUser) return;

    setSelectedUser(user);
    setUsers(
      users.map((u) => {
        if (u.id === user.id) return { ...u, updating: true };
        return u;
      })
    );
    setIsUpdatingUser(true);

    const res = await disconnectUserAndDogOwner(user.id);

    if (isUserUpdateSuccess(res)) {
      const { id, dogOwnerRefNo } = res;

      setUsers(
        users.map((u) => {
          if (u.id === id) return { ...u, dogOwnerRefNo, updating: false };
          return u;
        })
      );

      api.open({
        message: t.unlinkUserSuccessTitle,
        description: t.unlinkUserSuccessDescription,
        icon: <SmileOutlined style={{ color: "#0f96" }} />,
      });

      // here as disconnect user and dog owner, when open modal change role from VISITOR to DOG OWNER, such disconnected dog owner need to show again
      setDogOwnerFetched(false);
    } else {
      api.open({
        message: t.unlinkUserFailTitle,
        icon: <SmileOutlined style={{ color: "#f006" }} />,
      });
      setUsers(users.map((u) => ({ ...u, updating: false })));
    }
    resetUpdateUserInfo();
  };

  const handleToggleUserReceiveNotification = async (user: UserData) => {
    if (isUpdatingUser) return;

    setSelectedUser(user);
    setIsUpdatingUser(true);

    const response = await updateUserReceiveNotification(
      user.id,
      user.receiveNotifications ? 0 : 1
    );

    if (response?.status == 200)
      setUsers(
        users.map((usr: UserData) => {
          if (usr.id != user!.id) return usr;
          return {
            ...usr,
            receiveNotifications: !user.receiveNotifications,
          };
        })
      );

    setSelectedUser(null);
    setIsUpdatingUser(false);
  };

  const resetUpdateUserInfo = () => {
    setSelectedRole(null);
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

    const isRoleFromVisitorToDogOwner =
      selectedRole === UserRole.DOG_OWNER &&
      selectedUser.role === UserRole.VISITOR;

    if (isRoleFromVisitorToDogOwner && !dogOwnerRefNo) return;

    setIsUpdatingUser(true);

    const response = await updateUserRole(selectedUser!.id, {
      role: selectedRole!,
    });

    if (response?.status == 200) {
      const {
        data: { data },
      } = response;

      if (isRoleFromVisitorToDogOwner) await handleLinkDogOwner();

      const newUsers = users.map((user: UserData) => {
        if (user.id != selectedUser.id) return user;

        if (isRoleFromVisitorToDogOwner) data.dogOwnerRefNo = dogOwnerRefNo;

        return { ...user, ...data };
      });
      setUsers(newUsers);
    }

    setShowChangeRolePopup(false);
  };

  const handleCreateDogOwner = (ownerInfo: DogOwner) => {
    setDogOwners([
      ...dogOwners,
      { ...ownerInfo, value: ownerInfo.uid!, label: ownerInfo.name },
    ]);
    setDogOwnerRefNo(ownerInfo.uid!);
  };

  return isFetchingUsers ? (
    <LoadingList />
  ) : (
    <>
      {contextHolder}
      <ListTable data={users} />
      {/* Change User Role Modal */}
      <Modal
        title={t.editUserRole}
        closable={{ "aria-label": "Custom Close Button" }}
        open={showChangeRolePopup}
        onOk={handleConfirmChangeUserRole}
        okText={t.ok}
        onCancel={() => {
          setShowChangeRolePopup(false);
          setDogOwnerRefNo("");
        }}
        cancelText={t.cancel}
        okButtonProps={{
          loading: isUpdatingUser,
          disabled:
            selectedUser?.role! === UserRole.VISITOR &&
            selectedRole === UserRole.DOG_OWNER &&
            !dogOwnerRefNo,
        }}
        cancelButtonProps={{
          loading: isUpdatingUser,
        }}
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

        {selectedUser &&
        selectedUser.role === UserRole.VISITOR &&
        selectedRole === UserRole.DOG_OWNER ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "10px",
            }}
          >
            <Divider style={{ borderColor: "#7cb305" }}>
              {t.selectExistingOrCreateNewToLinkTo}
            </Divider>
            <div
              style={{
                display: "flex",
                columnGap: "10px",
                alignItems: "center",
              }}
            >
              <p style={{ margin: 0 }}>{t.selectDogOwner}: </p>
              {isLoadingDogOwners ? (
                <LoadingOutlined />
              ) : (
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Search to Select"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={dogOwners}
                  onSelect={(value) => setDogOwnerRefNo(value)}
                  value={dogOwnerRefNo}
                />
              )}
              <p>{t.or}</p>
            </div>
            <CreateDogOwner afterCreate={handleCreateDogOwner} />
          </div>
        ) : null}
      </Modal>
      {/* Link User to Dog Owner Modal */}
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
          ref={dogOwnerInputRef}
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
