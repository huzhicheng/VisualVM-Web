import React, { Component, useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Button,
  Affix,
  Drawer,
  List,
  message,
  Card,
  Input,
  InputNumber,
  Modal
} from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, ApiOutlined, PieChartOutlined, CodeOutlined, ApartmentOutlined } from '@ant-design/icons';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import "../styles/style.scss";
import logo from "../asset/photo.jpeg";
import { api, getData } from "../request";
import { setAttachJvm, setRightLicense } from '../stores/globalSlice';
import { menuToggle } from '../stores/menuSlice';
const { Search } = Input;
const { Header, Sider, Content, Footer } = Layout;

export function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export default function MainLayout() {

  let dispatch = useDispatch();
  const isAttachJvm = useSelector((state) => state.global.isAttachJvm);
  const isLeftMenu = useSelector((state) => state.menu.isLeftMenu);
  // const globalStore = store.global;
  // const menuStore = store.menu;


  const [collapsed, setCollapsed] = useState(false);
  const [drawerShow, setDrawerShow] = useState(false);
  const [jvmList, setJvmList] = useState([]);
  const [remoteHost, setRemoteHost] = useState("");
  const [remotePort, setRemotePort] = useState(8080);
  const [licenseShow, setLicenseShow] = useState(true);
  const [current, setCurrent] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (
      !isAttachJvm
    ) {
      showJvmDrawer();
    }
    //showJvmDrawer();
  }, [])

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  const goto = (e) => {
    //this.props.history.push(e.key);
    navigate(e.key);
    setCurrent(e.key);
  };

  const switchMenuStyle = () => {
    //this.props.menuStore.toogleMenuStyle();
    dispatch(menuToggle())
  };

  const showJvmDrawer = () => {
    loadLocalJvm();
    setDrawerShow(true);

  };

  const loadLocalJvm = () => {
    getData(api.getLocalJvms, {}).then(res => {
      if (res.success) {
        setJvmList(res.data || []);
      }
    });
  };

  const hostnameChange = e => {
    setRemoteHost(e.target.value);
  };

  const portChange = value => {
    setRemotePort(value);
  };

  const attachRemote = () => {

    getData(api.attachRemoteJvm, {
      host: remoteHost,
      port: remotePort
    }).then(res => {
      if (res.success) {
        //me.props.globalStore.setAttachJvmStatus(true);
        dispatch(setAttachJvm(true));
        setDrawerShow(false);
      } else {
        message.error("连接失败");
      }
    });
  };

  const attach = pid => {
    console.log(`get isattch ${isAttachJvm}`)
  
    getData(api.attachLocalJvm, { pid: pid }).then(res => {
      if (res.success) {
        
        setDrawerShow(false);
        dispatch(setAttachJvm(true));
        console.log(`layout ${isAttachJvm}`)
      } else {
        message.error("连接失败");
      }
    });
  };

  const license = code => {
    const me = this;
    getData(api.licenseAllowed, { licenseCode: code }).then(res => {
      if (res.success) {
        if (res.data) {
          dispatch(setRightLicense(true));
          setLicenseShow(false);
          showJvmDrawer();
        } else {
          message.error("验证码不正确，请重新输入吧");
        }
      }
    });
  };

  return (
    <Layout>
      <Header className="layout-header">
        <div className={!isLeftMenu ? "top-menu-logo" : "left-menu-logo"}>
          <Avatar src={logo} />
          <span
            style={{
              color: "white",
              fontWeight: "bold",
              padding: "10px 0 0 15px"
            }}
          >
            古时的风筝
          </span>
          {isLeftMenu && (
            <Button
              type="default"
              onClick={onCollapse}
              style={{ marginLeft: "30px", marginBottom: 16 }}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}>
            </Button>
          )}
        </div>
        {!isLeftMenu && (
          <div style={{ float: "left" }}>
            <Menu
              theme="dark"
              mode="horizontal"
              onClick={goto}
              selectedKeys={[current]}
              defaultSelectedKeys={[""]}
              style={{ lineHeight: "64px", width: "500px" }}
            >
              <Menu.Item key="">
                <PieChartOutlined />
                <span>仪表盘</span>
              </Menu.Item>
              <Menu.Item key="domain">
                <ApartmentOutlined />
                <span>MBeans</span>
              </Menu.Item>
              <Menu.Item key="about">
                <span>关于</span>
              </Menu.Item>
            </Menu>
          </div>
        )}
        <div style={{ float: "right" }}>
          <Button
            onClick={switchMenuStyle}
            className="switch-menu-btn"
            ghost
          >
            切换导航风格
          </Button>
        </div>
      </Header>
      <Layout>
        {isLeftMenu && (
          <Sider
            width={200}
            style={{ background: "#fff" }}
            collapsed={collapsed}
          >
            <Menu
              mode="inline"
              theme="dark"
              onClick={goto}
              selectedKeys={[current]}
              defaultSelectedKeys={[""]}
              style={{ height: "100%", borderRight: 0 }}
            >
              <Menu.Item key="">
                <PieChartOutlined />
                <span>仪表盘</span>
              </Menu.Item>
              <Menu.Item key="domain">
                <ApartmentOutlined />
                <span>MBeans</span>
              </Menu.Item>
              <Menu.Item key="about">
                <span>关于</span>
              </Menu.Item>
            </Menu>
          </Sider>
        )}
        <Layout>
          <Content style={{ margin: "10px 16px" }}>
            <Affix style={{ position: "absolute", top: 70, right: 30 }}>
              <div>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<ApiOutlined />}
                  onClick={showJvmDrawer}
                />
              </div>
            </Affix>
            <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
              <Outlet />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>古时的风筝</Footer>

          <Drawer
            title="连接 JVM"
            width={620}
            onClose={() => {
              setDrawerShow(false);
            }}
            open={drawerShow}
          >
            <List
              header={<div>本地 JVM</div>}
              footer={null}
              bordered
              dataSource={jvmList}
              renderItem={item => (
                <List.Item key={item.name}>
                  <List.Item.Meta
                    title={
                      <span>
                        {item.name}:{item.pid}
                      </span>
                    }
                  />
                  <div>
                    <Button
                      type="primary"
                      onClick={attach.bind(this, item.pid)}
                      icon={<CodeOutlined />}
                    >
                      连接
                    </Button>
                  </div>
                </List.Item>
              )}
            />
            <br />
            <Card title="连接远程 JVM">
              <Input
                type="text"
                onChange={hostnameChange}
                placeholder="远程服务器IP或hostname"
                style={{ width: "50%" }}
              />
              &nbsp;:&nbsp;
              <InputNumber placeholder="端口" onChange={portChange} />
              &nbsp;&nbsp;
              <Button type="primary" onClick={attachRemote} icon={<CodeOutlined />}>
                连接
              </Button>
            </Card>
          </Drawer>
        </Layout>
      </Layout>

      {/* <Modal
          title="验证"
          open={this.state.licenseShow}
          footer={null}
          closable={false}
        >
          <Search
            placeholder="请输入验证码"
            enterButton="验证"
            size="large"
            onSearch={this.license}
          />
        </Modal> */}
    </Layout>
  );

}

