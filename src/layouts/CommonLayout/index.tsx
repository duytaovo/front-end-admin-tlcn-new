import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Outlet } from "react-router-dom";
import { Grid } from "@mui/material";
import Sidebar from "./component/Sidebar";
import NavbarCustom from "./component/Navbar";
import _Menu from "src/components/menu/Menu";
import SideBarNew from "./component/SidebarNew";
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        className="h-screen overflow-scroll overscroll-auto"
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
      >
        <SideBarNew />
      </Sider>
      <Layout>
        <Content style={{ margin: "0 16px" }}>
          <div className="homeContainer">
            <NavbarCustom />
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          ©2023 Created by Vo Duy Tao
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;

