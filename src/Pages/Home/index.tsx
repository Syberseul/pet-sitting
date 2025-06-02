import React, { useEffect, useState } from "react";
import { Layout, Menu, Avatar, Space } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TranslationOutlined, UserOutlined } from "@ant-design/icons";

import type { MenuInfo } from "rc-menu/lib/interface";

import "./index.scss";
import { useUserState } from "@/util/customHooks";
import { UserRole } from "@/enums";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserState();

  const [selectedKey, setSelectedKey] = useState<string[]>([]);

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
              ? "寄养信息"
              : "首页",
          },
          {
            key: "/owners",
            label: "宠物主人",
            hidden: ![UserRole.ADMIN, UserRole.DEVELOPER].includes(user.role),
          },
          {
            key: "/users",
            label: "用户管理",
            hidden: ![UserRole.ADMIN, UserRole.DEVELOPER].includes(user.role),
          },
          {
            key: "/tours",
            label: "旅行信息",
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
        <TranslationOutlined
          style={{ color: "#fff", cursor: "pointer", fontSize: "20px" }}
        />
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
