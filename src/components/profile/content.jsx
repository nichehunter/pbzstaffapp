import { useEffect, useState } from "react";
import { Nav } from "rsuite";
import { selector } from "../../api";
import { StaffInfo, BranchInfo, QualificationInfo } from "./data";
import { DocumentInfo } from "./data/document";

export const ProfileContent = () => {
  const staff = selector.Staff();
  const [active, setActive] = useState("personal");
  const [loading, setLoading] = useState(false);

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
              Staff Profile
            </p>
          </div>
          <hr style={{ marginTop: -30 }} />
        </div>
        <div className="row">
          <div className="col-md-2 col-sm-12">
            <div className="card shadow p-2">
              <Nav
                reversed={true}
                vertical={true}
                activeKey={active}
                onSelect={setActive}
                style={{ width: 200 }}
                appearance="subtle"
              >
                <Nav.Item eventKey="personal" style={{ height: 50 }}>
                  <span className="h6 fs-14">Staff Information</span>
                </Nav.Item>
                <Nav.Item eventKey="branch" style={{ height: 50 }}>
                  <span className="h6 fs-14">Branch & Department</span>
                </Nav.Item>
                <Nav.Item eventKey="qualification" style={{ height: 50 }}>
                  <span className="h6 fs-14">Qualification</span>
                </Nav.Item>
                <Nav.Item eventKey="document" style={{ height: 50 }}>
                  <span className="h6 fs-14">Documents</span>
                </Nav.Item>
                <Nav.Item eventKey="attendance" style={{ height: 50 }}>
                  <span className="h6 fs-14">Attendance</span>
                </Nav.Item>
              </Nav>
            </div>
          </div>
          <div className="col-md-10 col-sm-12">
            <div className="card shadow p-3">
              {active === "personal" ? (
                <StaffInfo dataId={staff.id}/>
              ) : active === "branch" ? (
                <BranchInfo dataId={staff.id} />
              ) : active === "qualification" ? (
                <QualificationInfo dataId={staff.id} />
              ) : active === "document" ? (
                <DocumentInfo dataId={staff.id} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
