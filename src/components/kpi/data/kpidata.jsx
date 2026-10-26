import { useEffect, useState } from "react";
import {
  BarChartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  RightOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { Pagination } from "rsuite";
import { selector } from "../../../api";
import { hrmsCRUD } from "../../../actions/hrms";
import { char } from "../../../utils";
import moment from "moment";
import { StaffKPIItem } from "./kipiitem";

export const KPIData = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [kpi, setKpi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const user = selector.User();
  const staff = selector.Staff();
  const pageSize = 12;

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    hrmsCRUD
      .loadStaffKPI({
        limit: pageSize,
        offset: page,
        staffId: staff?.id,
        order: "-id",
      })
      .then((resp) => {
        setData(resp.data.results || []);
        setCount(resp.data.count || 0);
      })
      .catch(() => {
        setData([]);
        setCount(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [staff?.id, pageSize, page]);

  const getStatusConfig = (status) => {
    const normalized = String(status || "").toLowerCase();
    switch (normalized) {
      case "draft":
        return {
          label: "Draft",
          className: "pbz-kpi-status-draft",
          icon: <FileTextOutlined />,
        };
      case "submitted":
      case "submit":
        return {
          label: "Submitted",
          className: "pbz-kpi-status-submitted",
          icon: <ClockCircleOutlined />,
        };
      case "rejected":
      case "reject":
        return {
          label: "Rejected",
          className: "pbz-kpi-status-rejected",
          icon: <CloseCircleOutlined />,
        };
      case "approved":
      case "approve":
        return {
          label: "Approved",
          className: "pbz-kpi-status-approved",
          icon: <CheckCircleOutlined />,
        };
      case "archived":
      case "archive":
        return {
          label: "Archived",
          className: "pbz-kpi-status-archived",
          icon: <InboxOutlined />,
        };
      default:
        return {
          label: status || "Unknown",
          className: "pbz-kpi-status-default",
          icon: <FileTextOutlined />,
        };
    }
  };

  return (
    <>
      <div className="pbz-kpi-section">
        <div className="pbz-kpi-section-header">
          <div>
            <span>KPI RECORDS</span> <h2>Performance Periods</h2>
          </div>
          <small>
            {count} {count === 1 ? "record" : "records"}
          </small>
        </div>
        {loading ? (
          <div className="pbz-kpi-grid">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div className="pbz-kpi-card pbz-kpi-skeleton" key={item}>
                <div className="pbz-kpi-skeleton-top">
                  <div className="pbz-kpi-skeleton-status" />
                  <div className="pbz-kpi-skeleton-year" />
                </div>
                <div className="pbz-kpi-skeleton-icon" />
                <div className="pbz-kpi-skeleton-line large" />
                <div className="pbz-kpi-skeleton-line medium" />
                <div className="pbz-kpi-skeleton-line small" />
              </div>
            ))}
          </div>
        ) : data.length > 0 ? (
          <div className="pbz-kpi-grid">
            {data.map((kpi) => {
              const status = getStatusConfig(kpi.status);
              return (
                <div
                  key={kpi.id}
                  className="pbz-kpi-card"
                  onClick={() => {
                    setKpi(kpi);
                    setOpen(true);
                  }}
                >
                  <div className="pbz-kpi-card-top">
                    <span className={`pbz-kpi-status ${status.className}`}>
                      {status.icon} {status.label}
                    </span>
                    <span className="pbz-kpi-year">
                      <CalendarOutlined /> {moment(kpi.date).format("YYYY")}
                    </span>
                  </div>
                  <div className="pbz-kpi-icon">
                    <BarChartOutlined />
                  </div>
                  <div className="pbz-kpi-card-content">
                    <span className="pbz-kpi-code">
                      {char.toUpperCase(kpi.code)}
                    </span>
                    <h3> {char.toUpperCase(kpi.title)} </h3>
                  </div>
                  <div className="pbz-kpi-card-footer">
                    <span>
                      {status.label === "Draft"
                        ? "Continue assessment"
                        : "View KPI details"}
                    </span>
                    <span className="pbz-kpi-arrow">
                      <RightOutlined />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="pbz-kpi-empty">
            <div className="pbz-kpi-empty-icon">
              <BarChartOutlined />
            </div>
            <h3>No KPI periods found</h3>
            <p>
              There are currently no KPI periods available for your profile.
            </p>
          </div>
        )}
        {count > pageSize && (
          <div className="pbz-kpi-pagination">
            <Pagination
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              total={count}
              limit={pageSize}
              activePage={page + 1}
              onChangePage={(nextPage) => {
                setPage(nextPage - 1);
              }}
            />
          </div>
        )}
      </div>
      <StaffKPIItem open={open} setOpen={setOpen} kpi={kpi} />
    </>
  );
};
