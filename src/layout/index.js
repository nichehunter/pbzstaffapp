import React, { useEffect, useState } from "react";
import { UserOutlined, LockOutlined, LogoutOutlined } from "@ant-design/icons";
import { Layout, Menu, Dropdown, Space, Avatar, Badge as AntBadge } from "antd";
import { Footer } from "antd/es/layout/layout";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { selector } from "../api";
import { authActions, authCRUD } from "../actions/auth";
import { useDispatch } from "react-redux";
import { hrmsCRUD } from "../actions/hrms";
import { char } from "../utils";
import { useAuth } from "../context/AuthContext";
import "./style.css";

const { Header, Sider, Content } = Layout;

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

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("persist:root");
    navigate("/");
    document.location.reload();
  };

  const handleLock = () => {
    dispatch(authActions.setLock(true));
    dispatch(authActions.setAuth(null));

    getOtp({
      email: user.email,
      system: system.name,
      time: 30,
    });

    const currentPath = location.pathname;

    localStorage.setItem("fromPath", currentPath);

    navigate("/lockscreen", {
      replace: true,
    });
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

  /* =========================================================
     USER MENU
     ========================================================= */

  const items = [
    getItems("Profile", "1profile", <UserOutlined />, ""),

    getItems(
      <Link className="text-decoration-none" to="#" onClick={handleLock}>
        Lock Screen
      </Link>,
      "lock",
      <LockOutlined />,
      "",
    ),

    getItems(
      <Link className="text-decoration-none" to="#" onClick={handleLogout}>
        Logout
      </Link>,
      "out",
      <LogoutOutlined />,
      "",
    ),
  ];

  /* =========================================================
     SIDEBAR MENU
     ========================================================= */

  const itm = [
    getItems(
      <Link className="pbz-nav-link" to="/home">
        <span>Home</span>
      </Link>,
      "home",
      <i className="ri-home-5-line" />,
      "",
    ),
  ];

  roles.includes("can_view_profile") &&
    itm.push(
      getItems(
        <Link className="pbz-nav-link" to="/profile">
          <span>Profile</span>
        </Link>,
        "profile",
        <i className="ri-user-3-line" />,
        "",
      ),
    );

  roles.includes("can_view_finance") &&
    itm.push(
      getItems(
        <Link className="pbz-nav-link" to="/finance">
          <span>Salary Structure</span>
        </Link>,
        "finance",
        <i className="bi bi-coin" />,
        "",
      ),
    );

  roles.includes("can_view_leave") &&
    itm.push(
      getItems(
        <Link className="pbz-nav-link" to="/leave">
          <span>Leave</span>
        </Link>,
        "leave",
        <i className="bi bi-calendar2-check" />,
        "",
      ),
    );

  roles.includes("can_view_profile") &&
    itm.push(
      getItems(
        <Link className="pbz-nav-link" to="/kpi">
          <span>KPI</span>
        </Link>,
        "kpi",
        <i className="bi bi-speedometer2" />,
        "",
      ),
    );

  roles.includes("can_view_incidence") &&
    itm.push(
      getItems(
        <Link className="pbz-nav-link" to="/risk">
          <span>Incidence</span>
        </Link>,
        "risk",
        <i className="bi bi-exclamation-diamond" />,
        "",
      ),
    );

  roles.includes("can_view_assets") &&
    itm.push(
      getItems(
        <Link className="pbz-nav-link" to="#">
          <span>Assets</span>
        </Link>,
        "asset",
        <i className="bi bi-boxes" />,
        "",
      ),
    );

  roles.includes("can_view_assets") &&
    itm.push(
      getItems(
        <Link className="pbz-nav-link" to="#">
          <span>Loans</span>
        </Link>,
        "loan",
        <i className="bi bi-bank2" />,
        "",
      ),
    );

  roles.includes("can_view_assets") &&
    itm.push(
      getItems(
        <Link className="pbz-nav-link" to="#">
          <span>Masurufu</span>
        </Link>,
        "masurufu",
        <i className="bi bi-envelope-paper" />,
        "",
      ),
    );

  return (
    <Layout className="pbz-layout">
      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <Sider
        width={250}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        trigger={null}
        className="pbz-sidebar"
      >
        {/* BRAND */}
        <div className="pbz-sidebar-brand">
          <div className="pbz-sidebar-logo">
            <img src="assets/images/logo/pbz1.png" alt="PBZ" />
          </div>

          {!collapsed && (
            <div className="pbz-sidebar-brand-text">
              <strong>PBZ</strong>
              <span>STAFF PORTAL</span>
            </div>
          )}
        </div>

        {/* STAFF MINI PROFILE */}
        {!collapsed && (
          <div className="pbz-sidebar-profile">
            <Avatar size={42} className="pbz-avatar" icon={<UserOutlined />} />

            <div className="pbz-sidebar-profile-info">
              <strong>{user.username}</strong>
              <span>
                {char.toTitleCase(user?.first_name) +
                  " " +
                  char.toTitleCase(user?.last_name)}
              </span>
            </div>
          </div>
        )}

        {/* MENU */}
        <div className="pbz-sidebar-menu-title">
          {!collapsed && "WORKSPACE"}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[
            location.pathname === "/"
              ? "home"
              : location.pathname.replace("/", "") || "home",
          ]}
          className="pbz-sidebar-menu"
          items={itm}
        />

        {/* SIDEBAR FOOTER */}
        <div className="pbz-sidebar-bottom">
          {!collapsed && (
            <>
              <div className="pbz-sidebar-help">
                <div className="pbz-sidebar-help-icon">
                  <i className="bi bi-headset" />
                </div>

                <div>
                  <strong>Need assistance?</strong>
                  <span>Contact HR support</span>
                </div>
              </div>

              <div className="pbz-sidebar-version">PBZ Staff Portal</div>
            </>
          )}
        </div>
      </Sider>

      {/* =====================================================
          MAIN AREA
          ===================================================== */}

      <Layout className="pbz-main-layout">
        {/* ===================================================
            HEADER
            =================================================== */}

        <Header className="pbz-header">
          <div className="pbz-header-left">
            {/* SIDEBAR TOGGLE */}
            <button
              type="button"
              className="pbz-sidebar-toggle"
              onClick={() => setCollapsed(!collapsed)}
            >
              <i
                className={
                  collapsed ? "ri-menu-unfold-line" : "ri-menu-fold-line"
                }
              />
            </button>

            <div className="pbz-header-title">
              <strong>Staff Portal</strong>
              <span>People's Bank of Zanzibar</span>
            </div>
          </div>

          <div className="pbz-header-right">
            {/* APPLICATIONS */}
            <Dropdown
              menu={{
                items: apps.map((dt, i) =>
                  getItems(
                    <Link
                      to={dt.system.url}
                      target="new"
                      className="pbz-app-dropdown-item"
                    >
                      <span className="bi bi-grid" />
                      <span>{char.toTitleCase(dt.system.name)}</span>
                    </Link>,
                    i,
                  ),
                ),
              }}
              trigger={["click"]}
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}
            >
              <button type="button" className="pbz-header-action">
                <i className="ri-apps-2-line" />
                <span>Apps</span>
              </button>
            </Dropdown>

            {/* NOTIFICATION PLACEHOLDER */}
            <button type="button" className="pbz-header-icon-button">
              <AntBadge dot>
                <i className="ri-notification-3-line" />
              </AntBadge>
            </button>

            {/* USER */}
            <Dropdown
              menu={{
                items,
              }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <button type="button" className="pbz-user-menu">
                <Avatar
                  size={36}
                  className="pbz-user-avatar"
                  icon={<UserOutlined />}
                />

                <div className="pbz-user-details">
                  <strong title={user.username}>{user.username}</strong>

                  <span title={char.toTitleCase(user?.branch_name)}>
                    {char.toTitleCase(user?.branch_name)}
                  </span>
                </div>

                <i className="ri-arrow-down-s-line" />
              </button>
            </Dropdown>
          </div>
        </Header>

        {/* ===================================================
            CONTENT
            =================================================== */}

        <Content className="pbz-content">
          <div className="pbz-content-inner">
            <Outlet />
          </div>
        </Content>

        {/* ===================================================
            FOOTER
            =================================================== */}

        <Footer className="pbz-footer">
          <div className="pbz-footer-left">
            <strong>PBZ | Staff Portal</strong>
            <span>© {new Date().getFullYear()} People's Bank of Zanzibar</span>
          </div>

          <div className="pbz-footer-right">
            <span>Secure Employee Access</span>
            <i className="bi bi-shield-check" />
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
}
