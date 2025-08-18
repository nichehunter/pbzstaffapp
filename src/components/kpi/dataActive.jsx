import { useEffect, useState } from "react";
import { hrmsCRUD } from "../../actions/hrms";
import { char, code, number } from "../../utils";
import { Alert, Modal, Rate } from "antd";
import { selector } from "../../api";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { confirm } = Modal;


export const KPIDataActive = (props) => {
    const { dataId } = props;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [index, setIndex] = useState(0);
    const [alertInfo, setAlertInfo] = useState({ type: "", message: "" });
    const user = selector.User();
    const staff = selector.Staff();
    const navigate = useNavigate()

    const getStarRating = (actual) => {
      if (actual < 50) return 1;
      if (actual < 80) return 2;
      if (actual < 100) return 3;
      if (actual < 120) return 4;
      return 5;
    };

    const handleActualChange = (sectionId, resultId, perfId, value) => {
      const updated = { ...data };

      updated.section = updated.section.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          result: section.result.map((result) => {
            if (result.id !== resultId) return result;
            return {
              ...result,
              performance: result.performance.map((perf) => {
                if (perf.id !== perfId) return perf;

                const actualValue = Number(value);
                const ratingValue = getStarRating(actualValue);
                const weightingValue = Number(perf.weighting || 0);
                const weightedRatingValue = (weightingValue * ratingValue) / 5;

                return {
                  ...perf,
                  actual: actualValue,
                  rating: ratingValue,
                  weighted_rating: weightedRatingValue,
                };
              }),
            };
          }),
        };
      });

      setData(updated);
    };


   useEffect(() => {
     if (!dataId) return;

     setLoading(true);

     setTimeout(() => {
       hrmsCRUD
         .loadStaffKPINotActive(dataId, staff.id)
         .then((resp) => {
           console.log(resp.data);

           if (!Array.isArray(resp.data)) {
             navigate("/kpi", {
               state: {
                 page: "notactive",
                 dataId: dataId,
               },
             });
           } else {
             hrmsCRUD
               .loadStaffKPIActive(dataId)
               .then((resp) => {
                 setData(resp.data);
               })
               .catch((err) => {
                 console.error(err);
               });
           }
         })
         .catch((err) => {
           console.error(err);
         })
         .finally(() => {
           setLoading(false);
         });
     }, 1000);
   }, [dataId, staff.id, navigate, index]);

    const handleSave = () => {
      const emptyActuals = [];
      const payload = [];

      data.section.forEach((section) => {
        section.result.forEach((result) => {
          result.performance.forEach((perf) => {
            if (
              perf.actual === null ||
              perf.actual === undefined ||
              perf.actual === ""
            ) {
              emptyActuals.push({
                section: section.code,
                result: result.name,
                performance: perf.performance_measure,
              });
            } else {
              payload.push({
                kpi: dataId,
                perfomance: perf.id,
                actual: perf.actual,
                rating: perf.rating,
                weighting_rating: perf.weighted_rating,
                is_active: true,
                staff: staff.id,
                recorded_by: user.username,
              });
            }
          });
        });
      });

      if (emptyActuals.length > 0) {
        setAlertInfo({
          type: "error",
          message: `Please fill actual values for:\n${emptyActuals
            .map((e) => `Section ${e.section} - ${e.result} - ${e.performance}`)
            .join("\n")}`,
        });
        setTimeout(() => setAlertInfo({ type: "", message: "" }), 10000);
        return;
      }

      setLoading(true);
      setTimeout(() => {
        hrmsCRUD.addStaffKPI(payload).then(() => {
            setIndex(index + 1);
            setAlertInfo({
              type: "success",
              message: "Thank you..! Your data has been saved successfully.",
            });
            setTimeout(() => setAlertInfo({ type: "", message: "" }), 10000);
        }).catch(() => {
            setAlertInfo({
              type: "error",
              message: `Something went wrong while saving data`,
            });
            setTimeout(() => setAlertInfo({ type: "", message: "" }), 10000);
        }).finally(() => {
            setLoading(false);
        })
      })
      
    };

    const showConfirm = () => {
      confirm({
        title: `Dear ${char.toTitleCase(code.getFirstWord(staff?.full_name))},`,
        icon: <ExclamationCircleOutlined />,
        content: "Do you want to save?",
        okText: "Yes, Save",
        cancelText: "No, Cancel",
        centered: true,
        className: "custom-confirm-modal",
        onOk() {
          handleSave();
        },
        onCancel() {
          console.log("Cancelled");
        },
      });
    };
    

    return (
      <>
        {loading && (
          <div className="fullscreen-loader">
            <div className="spinner-border text-success" role="status"></div>
            <p className="mt-3">Please wait...</p>
          </div>
        )}
        <div className="container-fluid mt-2">
          <div className="row pe-4">
            <div className="col-md-10 col-sm-12">
              {alertInfo.message && (
                <Alert
                  message={alertInfo.message}
                  type={alertInfo.type}
                  showIcon
                  closable
                  style={{ marginBottom: "20px", whiteSpace: "pre-line" }}
                />
              )}
            </div>
            <div className="col-md-2 col-sm-12 text-end">
              <button
                className="btn btn-soft-success"
                onClick={() => showConfirm()}
                disabled={loading}
              >
                save <i className="bi bi-check-all" />
              </button>
            </div>
          </div>
          <hr />
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
                                <th style={{ width: "20%" }}>
                                  Key Result Area
                                </th>
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
                                <th style={{ width: "15%" }}>
                                  Weighted Rating
                                </th>
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
                                      {perf.fy_target}
                                    </td>
                                    <td>
                                      <input
                                        type="number"
                                        style={{ width: "100%" }}
                                        className="form-control form-control-sm"
                                        value={perf.actual ?? ""}
                                        onChange={(e) =>
                                          handleActualChange(
                                            section.id,
                                            result.id,
                                            perf.id,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </td>
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
                                      {number.fPercent(perf.weighted_rating)}
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
                                            sum +
                                            Number(p.weighted_rating || 0),
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
                                  {section.result
                                    .flatMap((r) => r.performance)
                                    .reduce(
                                      (sum, p) =>
                                        sum + Number(p.weighting || 0),
                                      0
                                    )}
                                  %
                                </td>
                                <td>
                                  {section.result
                                    .flatMap((r) => r.performance)
                                    .reduce(
                                      (sum, p) =>
                                        sum + Number(p.weighted_rating || 0),
                                      0
                                    )}
                                  %
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


}