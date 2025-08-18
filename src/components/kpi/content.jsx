import { useEffect, useState } from "react";
import { selector } from "../../api";
import { hrmsCRUD } from "../../actions/hrms";
import { char } from "../../utils";
import { useNavigate } from "react-router-dom";


export const KPIContent = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);
    const user = selector.User()
    const [search, setSearch] = useState("");
    const navigate = useNavigate()
    

    useEffect(() => {
      setLoading(true);
      setTimeout(() => {
        hrmsCRUD
          .loadStaffKPI(
            12,
            page,
            user.department_id,
            user.branch_id,
            user.position,
            search,
            "-id"
          )
          .then((resp) => {
            setData(resp.data.results);
            setCount(resp.data.count);
          })
          .catch(() => {})
          .finally(() => {
            setLoading(false);
          });
      });
    }, [user.id]);

    return (
      <>
        <div className="container mt-4">
          <div className="row">
            {data.map((kpi, index) => (
              <div key={index} className="col-md-3">
                <div
                  className={`card h-100 shadow-sm hover-shadow position-relative ${
                    !kpi.is_active ? "inactive-card" : "active-card"
                  }`}
                  onClick={() => {
                    navigate("/kpi", {
                      state: {
                        page: "active",
                        dataId: kpi.id,
                      },
                    });
                  }}
                  style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                >
                  {kpi.is_active && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ zIndex: 2 }}
                    >
                      New
                      <i className="bi bi-star-fill ms-1"></i>
                    </span>
                  )}
                  <div className="card-body text-center">
                    <i
                      className={"bi bi-bar-chart fs-1 mb-3"}
                      style={{ color: kpi.is_active ? "#008000" : "#6c757d" }}
                    ></i>
                    <h5 className={`h5 ${kpi.is_active ? "" : "text-muted"}`}>
                      {char.toUpperCase(kpi.code)}
                    </h5>
                    <p
                      className={`card-text h6 fs-16 ${
                        kpi.is_active ? "" : "text-muted"
                      }`}
                    >
                      {char.toUpperCase(kpi.name)}
                    </p>
                    <p
                      className={
                        kpi.is_active
                          ? `text-dark h6 fs-14`
                          : `text-muted h6 fs-14`
                      }
                    >
                      {kpi.year} - {kpi.is_active ? "Open" : "Closed"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );

}