import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { selector } from "../../api";
import { hrmsCRUD } from "../../actions/hrms";
import { char, code, greeting, number } from "../../utils";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./styles/home.css";
import { set } from "lodash";
import { SalarySlip } from "../finance/data/print";

export const HomeContent = () => {
  const staff = selector.Staff();
  const user = selector.User();
  const [lastSalary, setLastSalary] = useState(null);
  const [slip, setSlip] = useState(null);
  const [countLoading] = useState(false);
  const [slipOpen, setSlipOpen] = useState(false);

  useEffect(() => {
    if (user) {
      hrmsCRUD.loadStaffLastSalary(user.username).then((response) => {
        setLastSalary(response.data);
      });
    }
  }, [user]);

  useEffect(() => {
    if (staff) {
      setTimeout(() => {
        hrmsCRUD
          .loadPayroll(1, 0, staff.id, "", "-id")
          .then((resp) => {
            setSlip(resp.data.results[0]);
          })
          .catch(() => {
            setSlip(null);
          });
      }, 500);
    }
  }, [staff]);

  console.log(slip);

  const dashboard = useMemo(
    () => ({
      leave: {
        balance: 28,
        used: 0,
        entitlement: 28,
        pending: 0,
        nextLeave: "Unknown",
      },

      kpi: {
        cycle: "2026 Performance Cycle",
        submitted: true,
        progress: 0,
        status: "Draft",
        objectives: 8,
        completed: 0,
      },

      training: {
        completed: 0,
        total: 0,
        next: "Cyber Security Awareness",
        nextDate: "02 Oct 2026",
        progress: 0,
      },

      salary: {
        month: `${moment(lastSalary?.recorded_at).format("MMMM YYYY")}`,
        netSalary: `TZS ${number.fNumber(lastSalary?.net_salary) ?? ""}`,
        payslipAvailable: true,
        lastPaid: `${moment(lastSalary?.recorded_at).format("DD MMM YYYY") ?? ""}`,
      },

      masurufu: {
        pending: 1,
        approved: 4,
        total: "TZS ******",
      },

      activities: [
        {
          icon: "bi bi-check-circle",
          title: "KPI submitted",
          description: "2026 Performance Cycle",
          date: "Today",
          type: "success",
        },
        {
          icon: "bi bi-calendar-check",
          title: "Leave application approved",
          description: "Annual Leave • 0 days",
          date: "Today",
          type: "gold",
        },
        {
          icon: "bi bi-mortarboard",
          title: "Training completed",
          description: "Customer Service Excellence",
          date: "Today",
          type: "dark",
        },
        {
          icon: "bi bi-file-earmark-text",
          title: "Salary slip generated",
          description: moment(new Date()).format("MMMM YYYY"),
          date: "Today",
          type: "muted",
        },
      ],
    }),
    [lastSalary],
  );

  const firstName = staff?.full_name
    ? char.toTitleCase(code.getFirstWord(staff.full_name))
    : "Staff";

  return (
    <>
      <div className="pbz-dashboard">
        {/* =====================================================
          WELCOME BAR
          ===================================================== */}

        <div className="pbz-dashboard-welcome">
          <div className="pbz-dashboard-welcome-content">
            <div className="pbz-dashboard-welcome-icon">
              <i className="bi bi-person-check" />
            </div>

            <div>
              <span className="pbz-dashboard-eyebrow">
                EMPLOYEE SELF SERVICE
              </span>

              <h2>
                {greeting.generateGreetings()}, {firstName}.
              </h2>

              <p>
                Welcome back to your PBZ Staff Portal. Manage your employee
                information, leave, performance, training and payroll from one
                place.
              </p>
            </div>
          </div>

          <div className="pbz-dashboard-date">
            <span>TODAY</span>
            <strong>{moment(new Date()).format("ddd, DD MMM YYYY")}</strong>
            <small>{moment(new Date()).format("hh:mm A")}</small>
          </div>
        </div>

        {/* =====================================================
          ATTENTION / QUICK STATUS
          ===================================================== */}

        <div className="pbz-dashboard-attention">
          <div className="pbz-dashboard-attention-icon">
            <i className="bi bi-info-circle" />
          </div>

          <div className="pbz-dashboard-attention-content">
            <strong>Your employee profile is active</strong>
            <span>
              You have {dashboard.leave.pending} pending leave applications and
              your KPI submission is currently{" "}
              {dashboard.kpi.status.toLowerCase()}.
            </span>
          </div>

          <button type="button" className="pbz-dashboard-attention-action">
            View Updates
            <i className="bi bi-arrow-right" />
          </button>
        </div>

        {/* =====================================================
          OVERVIEW TITLE
          ===================================================== */}

        <div className="pbz-dashboard-section-heading">
          <div>
            <span>OVERVIEW</span>
            <h3>Your Employee Summary</h3>
          </div>

          <small>Updated today</small>
        </div>

        {/* =====================================================
          SUMMARY CARDS
          ===================================================== */}

        <div className="row g-3 pbz-dashboard-summary">
          {/* LEAVE */}
          <div className="col-xxl-3 col-xl-3 col-md-6">
            <div className="pbz-dashboard-card">
              {countLoading ? (
                <div className="pbz-dashboard-loader">
                  <Spin
                    indicator={
                      <LoadingOutlined style={{ fontSize: 24 }} spin />
                    }
                  />
                </div>
              ) : (
                <>
                  <div className="pbz-dashboard-card-top">
                    <div>
                      <span className="pbz-dashboard-card-label">
                        LEAVE BALANCE
                      </span>

                      <h4>
                        {dashboard.leave.balance}
                        <small> days</small>
                      </h4>
                    </div>

                    <div className="pbz-dashboard-card-icon pbz-icon-gold">
                      <i className="bi bi-calendar2-check" />
                    </div>
                  </div>

                  <div className="pbz-dashboard-progress">
                    <div
                      style={{
                        width: `${
                          (dashboard.leave.used / dashboard.leave.entitlement) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  <div className="pbz-dashboard-card-footer">
                    <span>
                      {dashboard.leave.used} used of{" "}
                      {dashboard.leave.entitlement}
                    </span>

                    <strong>{dashboard.leave.pending} pending</strong>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* KPI */}
          <div className="col-xxl-3 col-xl-3 col-md-6">
            <div className="pbz-dashboard-card">
              <div className="pbz-dashboard-card-top">
                <div>
                  <span className="pbz-dashboard-card-label">
                    KPI PERFORMANCE
                  </span>

                  <h4>
                    {dashboard.kpi.progress}
                    <small>%</small>
                  </h4>
                </div>

                <div className="pbz-dashboard-card-icon pbz-icon-dark">
                  <i className="bi bi-speedometer2" />
                </div>
              </div>

              <div className="pbz-dashboard-progress pbz-progress-dark">
                <div
                  style={{
                    width: `${dashboard.kpi.progress}%`,
                  }}
                />
              </div>

              <div className="pbz-dashboard-card-footer">
                <span>
                  {dashboard.kpi.completed}/{dashboard.kpi.objectives}{" "}
                  objectives
                </span>

                <strong>{dashboard.kpi.status}</strong>
              </div>
            </div>
          </div>

          {/* TRAINING */}
          <div className="col-xxl-3 col-xl-3 col-md-6">
            <div className="pbz-dashboard-card">
              <div className="pbz-dashboard-card-top">
                <div>
                  <span className="pbz-dashboard-card-label">TRAINING</span>

                  <h4>
                    {dashboard.training.completed}
                    <small> completed</small>
                  </h4>
                </div>

                <div className="pbz-dashboard-card-icon pbz-icon-soft">
                  <i className="bi bi-mortarboard" />
                </div>
              </div>

              <div className="pbz-dashboard-progress pbz-progress-soft">
                <div
                  style={{
                    width: `${dashboard.training.progress}%`,
                  }}
                />
              </div>

              <div className="pbz-dashboard-card-footer">
                <span>{dashboard.training.total} assigned</span>

                <strong>{dashboard.training.progress}%</strong>
              </div>
            </div>
          </div>

          {/* SALARY */}
          <div className="col-xxl-3 col-xl-3 col-md-6">
            <div className="pbz-dashboard-card">
              <div className="pbz-dashboard-card-top">
                <div>
                  <span className="pbz-dashboard-card-label">
                    LATEST SALARY
                  </span>

                  <h4 className="pbz-salary-value">
                    {dashboard.salary.netSalary}
                  </h4>
                </div>

                <div className="pbz-dashboard-card-icon pbz-icon-gold">
                  <i className="bi bi-receipt" />
                </div>
              </div>

              <div className="pbz-dashboard-card-simple">
                <span>{dashboard.salary.month}</span>

                <strong>
                  <i className="bi bi-check-circle-fill" />
                  Payslip available
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
          LOWER DASHBOARD
          ===================================================== */}

        <div className="row g-3 mt-1">
          {/* ===================================================
            LEFT - PERFORMANCE / TRAINING
            =================================================== */}

          <div className="col-xl-8">
            <div className="pbz-dashboard-panel">
              <div className="pbz-dashboard-panel-header">
                <div>
                  <span>MY PROGRESS</span>
                  <h3>Performance & Development</h3>
                </div>

                <button type="button" className="pbz-dashboard-link">
                  View All
                  <i className="bi bi-arrow-right" />
                </button>
              </div>

              <div className="pbz-progress-list">
                {/* KPI */}
                <div className="pbz-progress-item">
                  <div className="pbz-progress-item-icon pbz-icon-dark">
                    <i className="bi bi-graph-up-arrow" />
                  </div>

                  <div className="pbz-progress-item-content">
                    <div className="pbz-progress-item-title">
                      <strong>2026 KPI</strong>
                      <span>{dashboard.kpi.progress}%</span>
                    </div>

                    <div className="pbz-dashboard-progress pbz-progress-dark">
                      <div
                        style={{
                          width: `${dashboard.kpi.progress}%`,
                        }}
                      />
                    </div>

                    <small>
                      {dashboard.kpi.completed} of {dashboard.kpi.objectives}{" "}
                      objectives completed
                    </small>
                  </div>

                  <span className="pbz-status-badge pbz-status-review">
                    {dashboard.kpi.status}
                  </span>
                </div>

                {/* TRAINING */}
                <div className="pbz-progress-item">
                  <div className="pbz-progress-item-icon pbz-icon-gold">
                    <i className="bi bi-mortarboard" />
                  </div>

                  <div className="pbz-progress-item-content">
                    <div className="pbz-progress-item-title">
                      <strong>Training & Development</strong>
                      <span>{dashboard.training.progress}%</span>
                    </div>

                    <div className="pbz-dashboard-progress">
                      <div
                        style={{
                          width: `${dashboard.training.progress}%`,
                        }}
                      />
                    </div>

                    <small>
                      {dashboard.training.completed} training courses completed
                    </small>
                  </div>

                  <span className="pbz-status-badge pbz-status-complete">
                    On Track
                  </span>
                </div>

                {/* LEAVE */}
                <div className="pbz-progress-item">
                  <div className="pbz-progress-item-icon pbz-icon-soft">
                    <i className="bi bi-calendar-event" />
                  </div>

                  <div className="pbz-progress-item-content">
                    <div className="pbz-progress-item-title">
                      <strong>Annual Leave</strong>
                      <span>{dashboard.leave.balance} days left</span>
                    </div>

                    <div className="pbz-dashboard-progress pbz-progress-leave">
                      <div
                        style={{
                          width: `${
                            (dashboard.leave.used /
                              dashboard.leave.entitlement) *
                            100
                          }%`,
                        }}
                      />
                    </div>

                    <small>
                      Next planned leave: {dashboard.leave.nextLeave}
                    </small>
                  </div>

                  <span className="pbz-status-badge pbz-status-neutral">
                    {dashboard.leave.pending} Pending
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================
            RIGHT - PAYROLL
            =================================================== */}

          <div className="col-xl-4">
            <div className="pbz-dashboard-panel pbz-payroll-panel">
              <div className="pbz-dashboard-panel-header">
                <div>
                  <span>PAYROLL</span>
                  <h3>Latest Salary Slip</h3>
                </div>

                <div className="pbz-panel-header-icon">
                  <i className="bi bi-wallet2" />
                </div>
              </div>

              <div className="pbz-payroll-month">
                <div>
                  <span>NET SALARY</span>
                  <strong>{dashboard.salary.netSalary}</strong>
                </div>

                <div className="pbz-payroll-check">
                  <i className="bi bi-check-lg" />
                </div>
              </div>

              <div className="pbz-payroll-details">
                <div>
                  <span>Pay Period</span>
                  <strong>{dashboard.salary.month}</strong>
                </div>

                <div>
                  <span>Payment Date</span>
                  <strong>{dashboard.salary.lastPaid}</strong>
                </div>
              </div>

              <button
                onClick={() => setSlipOpen(true)}
                type="button"
                className="pbz-primary-outline-button"
              >
                <i className="bi bi-file-earmark-arrow-down" />
                View Salary Slip
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
          BOTTOM SECTION
          ===================================================== */}

        <div className="row g-3 mt-1">
          {/* RECENT ACTIVITY */}
          <div className="col-xl-8">
            <div className="pbz-dashboard-panel">
              <div className="pbz-dashboard-panel-header">
                <div>
                  <span>ACTIVITY</span>
                  <h3>Recent Activity</h3>
                </div>

                <button type="button" className="pbz-dashboard-link">
                  View History
                  <i className="bi bi-arrow-right" />
                </button>
              </div>

              <div className="pbz-activity-list">
                {dashboard.activities.map((activity, index) => (
                  <div
                    className="pbz-activity-item"
                    key={`${activity.title}-${index}`}
                  >
                    <div
                      className={`pbz-activity-icon pbz-activity-${activity.type}`}
                    >
                      <i className={activity.icon} />
                    </div>

                    <div className="pbz-activity-content">
                      <strong>{activity.title}</strong>
                      <span>{activity.description}</span>
                    </div>

                    <small>{activity.date}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MASURUFU / QUICK ACTIONS */}
          <div className="col-xl-4">
            <div className="pbz-dashboard-panel">
              <div className="pbz-dashboard-panel-header">
                <div>
                  <span>MASURUFU</span>
                  <h3>Staff Perdiem</h3>
                </div>

                <div className="pbz-panel-header-icon">
                  <i className="bi bi-envelope-paper" />
                </div>
              </div>

              <div className="pbz-expense-summary">
                <div>
                  <span>Total Approved</span>
                  <strong>{dashboard.masurufu.total}</strong>
                </div>

                <div className="pbz-expense-pending">
                  <i className="bi bi-clock" />
                  <span>{dashboard.masurufu.pending} pending request</span>
                </div>
              </div>

              <div className="pbz-quick-actions">
                <button type="button">
                  <i className="bi bi-plus-circle" />
                  <span>New Request</span>
                </button>

                <button type="button">
                  <i className="bi bi-clock-history" />
                  <span>View History</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
          STAFF SUPPORT MESSAGE
          ===================================================== */}

        <div className="pbz-dashboard-support">
          <div className="pbz-dashboard-support-icon">
            <i className="bi bi-shield-check" />
          </div>

          <div>
            <strong>Your information is protected</strong>
            <span>
              Access your personal employee information securely through the PBZ
              Staff Portal.
            </span>
          </div>

          <i className="bi bi-arrow-up-right" />
        </div>
      </div>
      <SalarySlip
        open={slipOpen}
        setOpen={setSlipOpen}
        dataId={slip?.payroll?.id}
        staffId={staff?.id}
      />
    </>
  );
};
