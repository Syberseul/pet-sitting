import React, { useEffect, useState } from "react";
import { Layout, Menu, Avatar, Space } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

import type { MenuInfo } from "rc-menu/lib/interface";

import "./index.scss";

import { useUserState } from "@/util/customHooks";

import { UserRole } from "@/enums";

import ToggleLanguageButton from "@/Components/ToggleLanguageButton";
import { useI18n } from "@/Context/languageContext";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserState();

  const [selectedKey, setSelectedKey] = useState<string[]>([]);

  const { t } = useI18n();

  useEffect(() => {
    if (location.pathname === "/") {
      let routeKey = "/";
      if (user.role === UserRole.ADMIN || user.role === UserRole.DEVELOPER)
        routeKey = "/dashboard";
      else routeKey = "/introduction";

      setSelectedKey([routeKey]);
      navigate(routeKey);
    }
  }, [location.pathname, user.role]);

  const navItem = [
    ...(user.uid
      ? [
          {
            key: [UserRole.ADMIN, UserRole.DEVELOPER].includes(user.role)
              ? "/dashboard"
              : "/introduction",
            label: [UserRole.ADMIN, UserRole.DEVELOPER].includes(user.role)
              ? t.indexPage
              : t.introPage,
          },
          {
            key: "/owners",
            label: t.ownersPage,
            hidden: ![UserRole.ADMIN, UserRole.DEVELOPER].includes(user.role),
          },
          {
            key: "/users",
            label: t.usersPage,
            hidden: ![UserRole.ADMIN, UserRole.DEVELOPER].includes(user.role),
          },
          {
            key: "/tours",
            label: t.toursPage,
            hidden: user.role !== UserRole.DOG_OWNER,
          },
        ]
      : []),
  ];

  const handleClickMenu = (e: MenuInfo) => {
    navigate(e.key);
    setSelectedKey([e.key]);
  };

  const handleClickAvatar = () => {
    navigate("/login");
    setSelectedKey([]);
  };

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header
        style={{ display: "flex", columnGap: "5px", alignItems: "center" }}
      >
        <Avatar
          shape="square"
          size="large"
          icon={<UserOutlined />}
          style={{
            cursor: "pointer",
          }}
          onClick={handleClickAvatar}
        />
        <Space />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={selectedKey}
          items={navItem.filter((item) => !item.hidden)}
          style={{ flex: 1, minWidth: 0 }}
          onClick={handleClickMenu}
        />
        <ToggleLanguageButton />
      </Header>
      <Content style={{ padding: "0 48px", flex: 1, overflow: "auto" }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default App;
