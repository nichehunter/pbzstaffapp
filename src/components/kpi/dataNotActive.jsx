import { useEffect, useState } from "react";
import { hrmsCRUD } from "../../actions/hrms";
import { char, number } from "../../utils";
import { Alert, Rate } from "antd";
import { selector } from "../../api";


export const KPIDataNotActive = (props) => {
  const { dataId } = props;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const staff = selector.Staff();

  useEffect(() => {
    if (dataId) {
      setLoading(true);
      setTimeout(() => {
        hrmsCRUD
          .loadStaffKPINotActive(dataId, staff.id)
          .then((resp) => {
            setData(resp.data);
          })
          .catch(() => {})
          .finally(() => {
            setLoading(false);
          });
      }, 1000);
    }
  }, [dataId, staff.id]);

  return (
    <>
      {loading && (
        <div className="fullscreen-loader">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-3">Please wait...</p>
        </div>
      )}
      <div className="container-fluid mt-2">
        <div
          className="row"
          style={{
            maxHeight: "70vh", // adjust height as needed
            overflowY: "auto",
            paddingRight: "10px", // avoids scrollbar overlap
          }}
        >
          <div className="col-12">
            {data &&
              data.section.map((section, i) => (
                <div key={section.id} className="mb-5">
                  <div className="card shadow-sm">
                    <div className="card-header bg-info text-white">
                      <h5 className="mb-0">
                        {char.toTitleCase(section.name.trim())}
                      </h5>
                    </div>
                    <div className="card-body">
                      {section.result.length > 0 ? (
                        <table
                          className="table table-bordered table-striped align-middle"
                          style={{ tableLayout: "fixed", width: "100%" }}
                        >
                          <thead>
                            <tr
                              style={{
                                backgroundColor: "#1fc9fa",
                                borderBottom: "2px solid #fef800",
                                color: "#212121",
                              }}
                            >
                              <th style={{ width: "20%" }}>Key Result Area</th>
                              <th style={{ width: "40%" }}>
                                Performance Measure
                              </th>
                              <th style={{ width: "10%" }}>FY Target</th>
                              <th style={{ width: "7%" }}>Actual</th>
                              <th style={{ width: "15%" }}>Rating</th>
                              <th style={{ width: "15%" }}>
                                Weighting{" "}
                                {number.fPercent(
                                  section?.result[i]?.weighting_percentage
                                )}
                              </th>
                              <th style={{ width: "15%" }}>Weighted Rating</th>
                            </tr>
                          </thead>
                          <tbody>
                            {section.result.map((result) =>
                              result.performance.map((perf, index) => (
                                <tr key={perf.id}>
                                  {/* Show Key Result Area only on the first performance row */}
                                  {index === 0 && (
                                    <td
                                      rowSpan={result.performance.length}
                                      className="fs-15 text-muted"
                                    >
                                      {char.toUpperCaseFirst(result.name)}
                                    </td>
                                  )}
                                  <td
                                    style={{ whiteSpace: "pre-line" }}
                                    className="fs-15 text-muted"
                                  >
                                    {perf.performance_measure}
                                  </td>
                                  <td className="fs-15 text-muted">
                                    {perf.fy_target}%
                                  </td>
                                  <td>{number.fPercent(perf.actual)}</td>
                                  <td>
                                    <Rate
                                      disabled
                                      value={perf.rating || 0}
                                      count={5}
                                      style={{ fontSize: "18px" }}
                                    />
                                  </td>
                                  <td className="fs-15 text-muted">
                                    {number.fPercent(perf.weighting)}
                                  </td>
                                  <td className="fs-15 text-muted">
                                    {number.fPercent(perf.weighting_rating)}
                                  </td>
                                </tr>
                              ))
                            )}

                            {/* Total row for section */}
                            <tr className="table-secondary fw-bold">
                              <td colSpan={2}>Total</td>
                              <td>-</td>
                              <td>-</td>
                              <td>
                                <Rate
                                  allowHalf
                                  disabled
                                  value={
                                    (section.result
                                      .flatMap((r) => r.performance)
                                      .reduce(
                                        (sum, p) =>
                                          sum + Number(p.weighting_rating || 0),
                                        0
                                      ) /
                                      section.result
                                        .flatMap((r) => r.performance)
                                        .reduce(
                                          (sum, p) =>
                                            sum + Number(p.weighting || 0),
                                          0
                                        )) *
                                    5
                                  }
                                  count={5}
                                  style={{ fontSize: "18px" }}
                                />
                              </td>
                              <td>
                                {number.fPercent(
                                  section.result
                                    .flatMap((r) => r.performance)
                                    .reduce(
                                      (sum, p) =>
                                        sum + Number(p.weighting || 0),
                                      0
                                    )
                                )}
                              </td>
                              <td>
                                {number.fPercent(
                                  section.result
                                    .flatMap((r) => r.performance)
                                    .reduce(
                                      (sum, p) =>
                                        sum + Number(p.weighting_rating || 0),
                                      0
                                    )
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-muted">
                          No results for this section
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};