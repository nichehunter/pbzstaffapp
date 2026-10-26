import { useEffect, useState } from "react";
import { Nav } from "rsuite";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { selector } from "../../api";
import { char, code } from "../../utils";
import { StaffInfo, BranchInfo, QualificationInfo } from "./data";
import { DocumentInfo } from "./data/document";
import "./styles/profile.css";

export const ProfileContent = () => {
  const staff = selector.Staff();
  const user = selector.User();

  const [active, setActive] = useState("personal");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [staff]);

  const firstName = staff?.full_name
    ? char.toTitleCase(code.getFirstWord(staff.full_name))
    : "Staff";

  const fullName = staff?.full_name
    ? char.toTitleCase(staff.full_name)
    : "Staff Member";

  const menuItems = [
    {
      key: "personal",
      label: "Staff Information",
      description: "Personal details",
      icon: "bi bi-person",
    },
    {
      key: "branch",
      label: "Branch & Department",
      description: "Work assignment",
      icon: "bi bi-building",
    },
    {
      key: "qualification",
      label: "Qualification",
      description: "Education & skills",
      icon: "bi bi-mortarboard",
    },
    {
      key: "document",
      label: "Documents",
      description: "Staff documents",
      icon: "bi bi-folder2",
    },
    {
      key: "attendance",
      label: "Attendance",
      description: "Attendance record",
      icon: "bi bi-calendar-check",
    },
  ];

  return (
    <div className="pbz-profile">
      {/* =====================================================
          PROFILE HEADER
          ===================================================== */}

      <div className="pbz-profile-header">
        <div className="pbz-profile-header-main">
          <Avatar
            size={58}
            className="pbz-profile-avatar"
            icon={<UserOutlined />}
          />

          <div className="pbz-profile-header-info">
            <span className="pbz-profile-eyebrow">EMPLOYEE PROFILE</span>

            <h2>{fullName}</h2>

            <div className="pbz-profile-meta">
              {user?.username && (
                <span>
                  <i className="bi bi-person-badge" />
                  {user.username}
                </span>
              )}

              {user?.branch_name && (
                <span>
                  <i className="bi bi-building" />
                  {char.toTitleCase(user?.branch_name)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pbz-profile-header-status">
          <span className="pbz-profile-status-dot" />
          <div>
            <strong>Active Staff</strong>
            <small>Employee record</small>
          </div>
        </div>
      </div>

      {/* =====================================================
          PROFILE BODY
          ===================================================== */}

      <div className="pbz-profile-body">
        {/* ===================================================
            NAVIGATION
            =================================================== */}

        <aside className="pbz-profile-navigation">
          <div className="pbz-profile-nav-title">PROFILE</div>

          <Nav
            vertical
            activeKey={active}
            onSelect={setActive}
            appearance="subtle"
            className="pbz-profile-nav"
          >
            {menuItems.map((item) => (
              <Nav.Item
                key={item.key}
                eventKey={item.key}
                className="pbz-profile-nav-item"
              >
                <div className="pbz-profile-nav-content">
                  <div className="pbz-profile-nav-icon">
                    <i className={item.icon} />
                  </div>

                  <div className="pbz-profile-nav-text">
                    <strong>{item.label}</strong>
                    <span>{item.description}</span>
                  </div>

                  <i className="bi bi-chevron-right pbz-profile-nav-arrow" />
                </div>
              </Nav.Item>
            ))}
          </Nav>
        </aside>

        {/* ===================================================
            CONTENT
            =================================================== */}

        <section className="pbz-profile-content">
          <div className="pbz-profile-content-header">
            <div>
              <span>
                {menuItems.find((item) => item.key === active)?.label}
              </span>

              <h3>
                {menuItems.find((item) => item.key === active)?.description}
              </h3>
            </div>

            <div className="pbz-profile-content-icon">
              <i
                className={menuItems.find((item) => item.key === active)?.icon}
              />
            </div>
          </div>

          <div className="pbz-profile-content-body">
            {loading ? (
              <div className="pbz-profile-loading">
                <div className="pbz-profile-spinner" />
                <span>Loading staff information...</span>
              </div>
            ) : (
              <>
                {active === "personal" && <StaffInfo dataId={staff.id} />}

                {active === "branch" && <BranchInfo dataId={staff.id} />}

                {active === "qualification" && (
                  <QualificationInfo dataId={staff.id} />
                )}

                {active === "document" && <DocumentInfo dataId={staff.id} />}

                {active === "attendance" && (
                  <div className="pbz-profile-coming-soon">
                    <div className="pbz-profile-coming-soon-icon">
                      <i className="bi bi-calendar-check" />
                    </div>

                    <h4>Attendance</h4>

                    <p>Your attendance information will be available here.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
