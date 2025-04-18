import React, { useState } from "react";
import { Layout, Menu, Avatar, Space } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { TranslationOutlined, UserOutlined } from "@ant-design/icons";

import type { MenuInfo } from "rc-menu/lib/interface";

import "./index.scss";
import { useUserState } from "@/util/customHooks";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const navigate = useNavigate();
  const user = useUserState();

  const [selectedKey, setSelectedKey] = useState<string[]>([]);

  const navItem = [
    ...(user.uid
      ? [
          {
            key: "/dashboard",
            label: "总览",
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
          items={navItem}
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
