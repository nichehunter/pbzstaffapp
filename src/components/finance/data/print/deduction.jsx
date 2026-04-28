import { useEffect, useState } from "react";
import { Divider, Modal } from "rsuite";
import { char, number } from "../../../../utils";
import { hrmsCRUD } from "../../../../actions/hrms";
import moment from "moment";
import { Card, Empty, Skeleton } from "antd";

export const PayrollDeduction = (props) => {
  const { open, setOpen, payrollId, staffId } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (payrollId && staffId) {
      setLoading(true);
      setTimeout(() => {
        hrmsCRUD
          .loadStaffPayrollDeduction({ payrollId, staffId })
          .then((resp) => {
            setData(resp.data);
            setLoading(false);
          })
          .catch(() => {
            setData([]);
            setLoading(false);
          });
      }, 500);
    }
  }, [payrollId, staffId]);

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)} size="lg">
        <Modal.Header>
          <Modal.Title>
            <div className="row">
              <div className="col-md-6 col-sm-12">Monthly Deduction</div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Divider />
        <Modal.Body>
          {/* Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 1fr 1fr",
              padding: "10px 12px",
              fontWeight: 600,
              fontSize: 13,
              color: "var(--text-muted)",
              borderBottom: "1px solid var(--table-border)",
            }}
          >
            <span>#</span>
            <span>Date</span>
            <span>Deduction</span>
            <span style={{ textAlign: "right" }} className="me-3">
              Amount
            </span>
          </div>

          {/* Loading */}
          {loading ? (
            <div style={{ padding: 10 }}>
              <Skeleton active paragraph={{ rows: 4 }} />
            </div>
          ) : !data.length ? (
            <div style={{ padding: "30px 0" }}>
              <Empty description="No allowance data available" />
            </div>
          ) : (
            <div style={{ maxHeight: 400, overflowY: "auto", padding: 10 }}>
              {data.map((dt, i) => (
                <div
                  key={dt.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr 1fr 1fr",
                    alignItems: "center",
                    padding: "12px",
                    marginBottom: 10,
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.06), 0 6px 12px rgba(0,0,0,0.08)",
                    transition: "all 0.2s ease",
                  }}
                  className="row-card"
                >
                  {/* Date */}
                  <span style={{ color: "#6b7280", fontSize: 12 }}>
                    #{i + 1}
                  </span>

                  {/* SN */}
                  <span style={{ color: "#111827", fontSize: 12 }}>
                    {dt.date ? moment(dt.date).format("MMM DD, YYYY") : "N/A"}
                  </span>

                  {/* Allowance */}
                  <span
                    style={{
                      fontWeight: 500,
                      color: "#111827",
                    }}
                  >
                    {dt.deduction_name
                      ? char.toTitleCase(dt.deduction_name)
                      : "N/A"}
                  </span>

                  {/* Amount */}
                  <span
                    style={{
                      textAlign: "right",
                      fontWeight: 600,
                      color: "#16a34a",
                    }}
                  >
                    {number.fNumberDoublePoint(dt.amount || 0)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Divider style={{ marginTop: -10 }} />
      </Modal>
    </>
  );
};
