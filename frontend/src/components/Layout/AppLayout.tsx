import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import type { MenuProps } from 'antd/es/menu';
import {
  DashboardOutlined,
  BarChartOutlined,
  LineChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  GlobalOutlined,
  BulbOutlined,
  FileTextOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

const { Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', 'dashboard', <DashboardOutlined />),
  getItem('Policy Simulator', 'simulator', <LineChartOutlined />),
  getItem('Economic Impact', 'impact', <BarChartOutlined />),
  getItem('Policy Globe', 'globe', <GlobalOutlined />),
  getItem('AI Advisor', 'advisor', <BulbOutlined />),
  getItem('Live Feed', 'feed', <FileTextOutlined />),
  getItem('Gamification', 'gamification', <TrophyOutlined />),
  getItem('Community', 'community', <TeamOutlined />),
  getItem('Settings', 'settings', <SettingOutlined />),
];

const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={250}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          boxShadow: '2px 0 8px 0 rgba(0,0,0,0.1)',
        }}
      >
        <div className="demo-logo-vertical" style={{
          height: '64px',
          margin: '16px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: 'bold',
        }}>
          {!collapsed ? 'PolicyPulse' : 'PP'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          selectedKeys={[location.pathname]}
          items={items}
          style={{ borderRight: 0 }}
          onClick={({ key }) => {
            navigate(key);
            // Force a re-render of the content
            window.dispatchEvent(new Event('popstate'));
          }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'all 0.2s' }}>
        <div style={{ 
          padding: '16px 24px', 
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0',
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}>
          <div>
            <h2 style={{ margin: 0 }}>PolicyPulse</h2>
            <p style={{ margin: 0, fontSize: 12, color: '#8c8c8c' }}>Making policy analysis accessible</p>
          </div>
          <Button 
            type="text" 
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </div>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 'calc(100vh - 112px)',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
