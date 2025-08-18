import { useEffect, useState } from "react";
import { Nav } from "rsuite";
import { selector } from "../../api";
import { LeaveApplication, LeaveSupervise } from "./data";

export const LeaveContent = () => {
  const staff = selector.Staff();
  const [active, setActive] = useState("application");
  const [loading, setLoading] = useState(false);
  const roles = selector.Roles()


  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [staff]);

  return (
    <>
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-12">
            <p className="h6 fs-20 fw-bold" style={{ marginTop: -70 }}>
              Staff Leave
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
                <Nav.Item eventKey="application" style={{ height: 50 }}>
                  <span className="h6 fs-14">Leave Application</span>
                </Nav.Item>
                {roles.includes("can_view_leave_assignment") && (
                  <Nav.Item eventKey="supervise" style={{ height: 50 }}>
                    <span className="h6 fs-14">Leave Assignment</span>
                  </Nav.Item>
                )}
              </Nav>
            </div>
          </div>
          <div className="col-md-10 col-sm-12">
            <div className="card shadow p-3">
              {active === "application" ? (
                <LeaveApplication dataId={staff.id} />
              ) : active === "supervise" ? (
                <LeaveSupervise />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
