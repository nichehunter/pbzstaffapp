import { useState } from "react";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  FileAddOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Nav } from "rsuite";
import { selector } from "../../api";
import { LeaveApplication, LeaveSupervise } from "./data";
import "./style/leave.css";
export const LeaveContent = () => {
  const staff = selector.Staff();
  const roles = selector.Roles();
  const [active, setActive] = useState("application");
  const menuItems = [
    {
      eventKey: "application",
      label: "Leave Application",
      description: "Apply and view your leave",
      icon: <FileAddOutlined />,
    },
  ];
  if (roles.includes("can_view_leave_assignment")) {
    menuItems.push({
      eventKey: "supervise",
      label: "Leave Assignment",
      description: "Manage staff leave",
      icon: <TeamOutlined />,
    });
  }
  const activeItem = menuItems.find((item) => item.eventKey === active);
  return (
    <div className="container-fluid pbz-leave">
      {/* ===================================================== PAGE HEADER ===================================================== */}
      <div className="pbz-page-header">
        <div>
          <div className="pbz-page-eyebrow">
            <CalendarOutlined /> STAFF LEAVE MANAGEMENT
          </div>
          <h1 className="pbz-page-title">Staff Leave</h1>
          <p className="pbz-page-description">
            Manage your leave applications, assignments and available leave
            balance.
          </p>
        </div>
      </div>
      {/* ===================================================== LEAVE LAYOUT ===================================================== */}
      <div className="pbz-leave-layout">
        {/* =================================================== SIDEBAR =================================================== */}
        <aside className="pbz-leave-sidebar">
          <div className="pbz-leave-nav-header">
            <span>Leave Information</span> <small>STAFF RECORD</small>
          </div>
          <Nav
            vertical
            activeKey={active}
            onSelect={setActive}
            appearance="subtle"
            className="pbz-leave-nav"
          >
            {menuItems.map((item) => (
              <Nav.Item
                key={item.eventKey}
                eventKey={item.eventKey}
                className="pbz-leave-nav-item"
              >
                <div className="pbz-leave-nav-content">
                  <span className="pbz-leave-nav-icon"> {item.icon} </span>
                  <span className="pbz-leave-nav-text">
                    <strong>{item.label}</strong>
                    <span>{item.description}</span>
                  </span>
                </div>
              </Nav.Item>
            ))}
          </Nav>
          {/* ================================================= LEAVE BALANCE ================================================= */}
          <div className="pbz-leave-balance">
            <div className="pbz-leave-balance-header">
              <div className="pbz-leave-balance-icon">
                <CheckCircleOutlined />
              </div>
              <div>
                <span>LEAVE BALANCE</span> <strong>Available Leave</strong>
              </div>
            </div>
            <div className="pbz-leave-balance-value">
              <strong>—</strong> <span>Days</span>
            </div>
            <div className="pbz-leave-balance-footer">
              <span>Annual Leave</span> <small>Balance</small>
            </div>
          </div>
        </aside>
        {/* =================================================== CONTENT =================================================== */}
        <section className="pbz-leave-content">
          <div className="pbz-leave-content-header">
            <div className="pbz-leave-content-icon">{activeItem?.icon}</div>
            <div>
              <span>LEAVE INFORMATION</span> <h2>{activeItem?.label}</h2>
              <p>{activeItem?.description}</p>
            </div>
          </div>
          <div className="pbz-leave-content-body">
            {active === "application" && <LeaveApplication dataId={staff.id} />}
            {active === "supervise" && <LeaveSupervise />}
          </div>
        </section>
      </div>
    </div>
  );
};
