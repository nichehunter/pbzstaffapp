import React, { useEffect, useState } from "react";
import { UserOutlined, LockOutlined, LogoutOutlined } from "@ant-design/icons";
import { Layout, Menu, Button, theme, Dropdown, Space } from "antd";
import { Footer } from "antd/es/layout/layout";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { selector } from "../api";
import { authActions, authCRUD } from "../actions/auth";
import { useDispatch } from "react-redux";
import { hrmsCRUD } from "../actions/hrms";
import { char } from "../utils";
import { Badge } from "rsuite";
import { useAuth } from "../context/AuthContext";

const { Header, Sider, Content } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

function getItems(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

export default function MasterLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const [apps, setApps] = useState([]);
  const [data, setDaata] = useState({});
  const [supervisor, setSupervisor] = useState([]);
  const { getOtp } = useAuth();
  const user = selector.User();
  const roles = selector.Roles();
  const system = selector.System();
  let location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  let navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("persist:root");
    navigate("/");
    document.location.reload();
  };

  const handleLock = () => {
    dispatch(authActions.setLock(true));
    dispatch(authActions.setAuth(null));
    getOtp({ email: user.email, system: system.name, time: 30 });
    const currentPath = location.pathname;
    localStorage.setItem("fromPath", currentPath);
    navigate("/lockscreen", { replace: true });
  };


  useEffect(() => {
    setTimeout(() => {
      authCRUD
        .loadSystemUser(user.id, "system__name")
        .then((resp) => {
          setApps(resp.data);
        })
        .catch(() => {});

      hrmsCRUD
        .loadStaffData(user.username)
        .then((resp) => {
          setDaata(resp.data);
          dispatch(authActions.getStaff(resp.data));
        })
        .catch(() => {})
        .finally(() => {});
    }, 500);
  }, [user]);

  // const item = [
  //   getItem(
  //     "Apps",
  //     "app",
  //     <i className="ri-apps-2-line fs-4" />,
  //     apps.map((dt, i) =>
  //       getItem(
  //         <Link
  //           to={dt.apps.link}
  //           state={{ user: user }}
  //           className="text-decoration-none text-white fw-bold"
  //         >
  //           <span className={dt.apps.icon}></span>
  //           <span className="ms-2">{char.toTitleCase(dt.apps.name)}</span>
  //         </Link>,
  //         i
  //       )
  //     )
  //   ),
  // ];

  // const app = [
  //   getItem(
  //     "Apps",
  //     "app",
  //     <i className="ri-apps-2-line fs-4" />,
  //     apps.map((dt, i) =>
  //       getItem(
  //         <Link
  //           to={dt.apps.link}
  //           state={{ user: user }}
  //           className="text-decoration-none text-white fw-bold"
  //         >
  //           <span className={dt.apps.icon}></span>
  //           <span className="ms-2">{char.toTitleCase(dt.apps.name)}</span>
  //         </Link>,
  //         i
  //       )
  //     )
  //   ),
  // ];

  const items = [
    getItems("Profile", "1profile", <UserOutlined />, ""),
    getItems(
      <Link className="text-decoration-none" to={"#"} onClick={handleLock}>
        Lock Screen
      </Link>,
      "lock",
      <LockOutlined />,
      ""
    ),
    getItems(
      <Link className="text-decoration-none" to={"#"} onClick={handleLogout}>
        Logout
      </Link>,
      "out",
      <LogoutOutlined />,
      ""
    ),
  ];

  const itm = [
    getItems(
      <Link className="text-decoration-none fw-bold fs-6" to={"/home"}>
        Home
      </Link>,
      "home",
      <i className="ri-home-line fs-4" />,
      ""
    ),
  ];

  roles.includes("can_view_profile") &&
    itm.push(
      getItems(
        <Link className="text-decoration-none fw-bold fs-6" to={"/profile"}>
          Profile
        </Link>,
        "profile",
        <i className="ri-user-line fs-4" />,
        ""
      )
    );
  
  roles.includes("can_view_finance") &&
    itm.push(
      getItems(
        <Link className="text-decoration-none fw-bold fs-6" to={"/finance"}>
          Salary Structure
        </Link>,
        "finance",
        <i className="bi bi-coin fs-4" />,
        ""
      )
    );

  roles.includes("can_view_leave") &&
    itm.push(
      getItems(
        <Link className="text-decoration-none fw-bold fs-6" to={"/leave"}>
          Leave 
        </Link>,
        "leave",
        <i className="bi bi-door-open fs-4" />,
        ""
      )
    );

    roles.includes("can_view_profile") &&
      itm.push(
        getItems(
          <Link className="text-decoration-none fw-bold fs-6" to={"/kpi"}>
            KPI
          </Link>,
          "kpi",
          <i className="bi bi-speedometer fs-4" />,
          ""
        )
      );

    roles.includes("can_view_incidence") &&
      itm.push(
        getItems(
          <Link className="text-decoration-none fw-bold fs-6" to={"/risk"}>
            Incidence 
          </Link>,
          "incidence",
          <i className="bi bi-app-indicator fs-4" />,
          ""
        )
      );

  roles.includes("can_view_assets") &&
    itm.push(
      getItems(
        <Link className="text-decoration-none fw-bold fs-6" to={"#"}>
          Assets 
        </Link>,
        "asset",
        <i className="bi bi-boxes fs-4" />,
        ""
      )
    );

  roles.includes("can_view_assets") &&
    itm.push(
      getItems(
        <Link className="text-decoration-none fw-bold fs-6" to={"#"}>
          Loans
        </Link>,
        "loan",
        <i className="bi bi-coin fs-4" />,
        ""
      )
    );

  roles.includes("can_view_assets") &&
    itm.push(
      getItems(
        <Link className="text-decoration-none fw-bold fs-6" to={"#"}>
          Masurufu
        </Link>,
        "masurufu",
        <i className="bi bi-envelope-paper fs-4" />,
        ""
      )
    );

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          top: 0,
          position: "sticky",
          zIndex: 1,
          width: "100%",
        }}
      >
        <div className="demo-logo-vertical mb-2 text-center">
          <span className="h3 text-white fw-bold mt-0">PBZ | PORTAL</span>
        </div>

        <Dropdown
          menu={{
            items: apps.map((dt, i) =>
              getItem(
                <Link
                  to={dt.system.url}
                  target="new"
                  className="fw-bold"
                >
                  <span className={"bi bi-app"}></span>
                  <span className="ms-2">{char.toTitleCase(dt.system.name)}</span>
                </Link>,
                i
              )
            ),
          }}
          trigger={["click"]}
          placement="bottomCenter"
          arrow={{ pointAtCenter: true }}
          className="cursor-pointer fw-bold h3 text-white ms-5"
        >
          <Space>
            <i className="ri-settings-4-line fs-5 fw-bold" />
            <span className="h3 text-white fw-bold">apps</span>
          </Space>
        </Dropdown>

        <div className="position-absolute top-0 end-0 text-white">
          <Dropdown menu={{ items }} className="me-5 cursor-pointer">
            <Space>
              <i className="ri-user-line fs-5" />
              {user.username}
            </Space>
          </Dropdown>
        </div>
      </Header>
      <Content
        style={{
          padding: "40px 48px",
        }}
      >
        <Layout
          style={{
            padding: "24px 0",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Sider
            style={{
              background: colorBgContainer,
            }}
            width={200}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={["home"]}
              defaultOpenKeys={["sub1"]}
              style={{
                height: "100%",
                width: "250px",
              }}
              items={itm}
            />
          </Sider>
          <Content
            style={{
              margin: "50px 45px",
              padding: 24,
              minHeight: "65vh",
              background: "whitesmoke",
              borderRadius: 5,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Content>

      <Footer
        style={{
          textAlign: "center",
        }}
      >
        <span className="fw-bold">
          PBZ | Staff Portal © {new Date().getFullYear()}
        </span>{" "}
        | Developed by <Link className="text-success">PBZ</Link>
      </Footer>
    </Layout>
  );
}
