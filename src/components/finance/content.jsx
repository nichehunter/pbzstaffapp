import { useState } from "react";
import {
  BankOutlined,
  FileTextOutlined,
  MinusCircleOutlined,
  WalletOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Nav } from "rsuite";
import { selector } from "../../api";
import { StaffSalary } from "./data/salary";
import {
  StaffMonthlyAllowance,
  StaffMonthlyDeduction,
  StaffPayroll,
} from "./data";
import "./style/finance.css";

export const FinanceContent = () => {
  const staff = selector.Staff();
  const [active, setActive] = useState("salary");

  const menuItems = [
    {
      eventKey: "salary",
      label: "Salary",
      description: "Basic salary structure",
      icon: <WalletOutlined />,
    },
    {
      eventKey: "montallowance",
      label: "Monthly Allowance",
      description: "Monthly earnings",
      icon: <PlusCircleOutlined />,
    },
    {
      eventKey: "montdeduction",
      label: "Monthly Deduction",
      description: "Monthly deductions",
      icon: <MinusCircleOutlined />,
    },
    {
      eventKey: "payroll",
      label: "Salary Slip",
      description: "Payroll statements",
      icon: <FileTextOutlined />,
    },
  ];

  const activeItem = menuItems.find((item) => item.eventKey === active);

  return (
    <div className="container-fluid pbz-finance">
      
      <div className="pbz-page-header">
        <div>
          <div className="pbz-page-eyebrow">
            <BankOutlined />
            FINANCIAL MANAGEMENT
          </div>

          <h1 className="pbz-page-title">Financial Structure</h1>

          <p className="pbz-page-description">
            View your salary, allowances, deductions and payroll information.
          </p>
        </div>
      </div>

      
      <div className="pbz-finance-layout">
        
        <aside className="pbz-finance-sidebar">
          <div className="pbz-finance-nav-header">
            <span>Financial Information</span>
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
              <span>FINANCIAL INFORMATION</span>
              <h2>{activeItem?.label}</h2>
              <p>{activeItem?.description}</p>
            </div>
          </div>

          <div className="pbz-finance-content-body">
            {active === "salary" && <StaffSalary dataId={staff.id} />}

            {active === "montallowance" && (
              <StaffMonthlyAllowance dataId={staff.id} />
            )}

            {active === "montdeduction" && (
              <StaffMonthlyDeduction dataId={staff.id} />
            )}

            {active === "payroll" && <StaffPayroll dataId={staff.id} />}
          </div>
        </section>
      </div>
    </div>
  );
};
