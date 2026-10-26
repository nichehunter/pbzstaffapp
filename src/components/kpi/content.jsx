import { useState } from "react";
import { BarChartOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Nav } from "rsuite";
import { selector } from "../../api";
import "./style/kpi.css";
import { KPIData, KPAAssignment } from "./data";

export const KPIContent = () => {
  const staff = selector.Staff();

  const menuItems = [
    {
      eventKey: "kpi",
      label: "KPI",
      description: "Key performance indicators",
      icon: <BarChartOutlined />,
    },

    ...(!staff?.is_boss
      ? [
          {
            eventKey: "assignment",
            label: "KPI Assignment",
            description: "Assigned KPIs of staff members",
            icon: <PlusCircleOutlined />,
          },
        ]
      : []),
  ];

  const [active, setActive] = useState("kpi");

  const activeItem = menuItems.find((item) => item.eventKey === active);

  return (
    <>
      <div className="container-fluid pbz-kpi">
        <div className="pbz-page-header">
          <div>
            <div className="pbz-page-eyebrow">
              <BarChartOutlined /> PERFORMANCE MANAGEMENT
            </div>
            <h1 className="pbz-page-title"> Key Performance Indicators </h1>
            <p className="pbz-page-description">
              Review your KPI periods and access the corresponding performance
              assessment.
            </p>
          </div>
        </div>
        <div className="pbz-kpi-layout">
          <aside className="pbz-finance-sidebar">
            <div className="pbz-finance-nav-header">
              <span>Performance Management</span>
              <small>STAFF RECORD</small>
            </div>

            <Nav
              vertical
              activeKey={active}
              onSelect={setActive}
              appearance="subtle"
              className="pbz-finance-nav"
            >
              {menuItems.map((item) => (
                <Nav.Item
                  key={item.eventKey}
                  eventKey={item.eventKey}
                  className="pbz-finance-nav-item"
                >
                  <div className="pbz-finance-nav-content">
                    <span className="pbz-finance-nav-icon">{item.icon}</span>

                    <span className="pbz-finance-nav-text">
                      <strong>{item.label}</strong>
                      <span>{item.description}</span>
                    </span>
                  </div>
                </Nav.Item>
              ))}
            </Nav>
          </aside>

          <section className="pbz-finance-content">
            <div className="pbz-finance-content-header">
              <div className="pbz-finance-content-icon">{activeItem?.icon}</div>

              <div>
                <span>PERFORMANCE MANAGEMENT</span>
                <h2>{activeItem?.label}</h2>
                <p>{activeItem?.description}</p>
              </div>
            </div>

            <div className="pbz-finance-content-body">
              {active === "kpi" && <KPIData />}
              {active === "assignment" && <KPAAssignment />}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
