import { useEffect, useState } from "react";
import { Nav } from "rsuite";
import { selector } from "../../api";
import { StaffSalary } from "./data/salary";
import {
  StaffAllowance,
  StaffDeduction,
  StaffMonthlyAllowance,
  StaffMonthlyDeduction,
  StaffOrganization,
  StaffPayroll,
} from "./data";

export const FinanceContent = () => {
  const staff = selector.Staff();
  const [active, setActive] = useState("salary");

  return (
    <>
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-12">
            <p className="h6 fs-20 fw-bold" style={{ marginTop: -70 }}>
              Financial Structure
            </p>
          </div>
          <hr style={{ marginTop: -30 }} />
        </div>
        <div className="row">
          <div className="col-md-2 col-sm-12">
            <div className="card shadow p-3">
              <Nav
                reversed={true}
                vertical={true}
                activeKey={active}
                onSelect={setActive}
                style={{ width: 200 }}
                appearance="subtle"
              >
                <Nav.Item eventKey="salary" style={{ height: 50 }}>
                  <span className="h6 fs-14">Salary</span>
                </Nav.Item>
                <Nav.Item eventKey="allowance" style={{ height: 50 }}>
                  <span className="h6 fs-14">Allowance</span>
                </Nav.Item>
                <Nav.Item eventKey="deduction" style={{ height: 50 }}>
                  <span className="h6 fs-14">Deduction</span>
                </Nav.Item>
                <Nav.Item eventKey="organization" style={{ height: 50 }}>
                  <span className="h6 fs-14">Organization</span>
                </Nav.Item>
                <Nav.Item eventKey="montallowance" style={{ height: 50 }}>
                  <span className="h6 fs-14">Monthly Allowance</span>
                </Nav.Item>
                <Nav.Item eventKey="montdeduction" style={{ height: 50 }}>
                  <span className="h6 fs-14">Monthly Deduction</span>
                </Nav.Item>
                <Nav.Item eventKey="payroll" style={{ height: 50 }}>
                  <span className="h6 fs-14">Payroll</span>
                </Nav.Item>
              </Nav>
            </div>
          </div>
          <div className="col-md-10 col-sm-12">
            <div className="card shadow p-3">
              {active === "salary" ? (
                <StaffSalary dataId={staff.id} />
              ) : active === "allowance" ? (
                <StaffAllowance dataId={staff.id} />
              ) : active === "deduction" ? (
                <StaffDeduction dataId={staff.id} />
              ) : active === "organization" ? (
                <StaffOrganization dataId={staff.id} />
              ) : active === "montallowance" ? (
                <StaffMonthlyAllowance dataId={staff.id} />
              ) : active === "montdeduction" ? (
                <StaffMonthlyDeduction dataId={staff.id} />
              ) : active === "payroll" ? (
                <StaffPayroll dataId={staff.id} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
