import { useEffect, useRef, useState } from "react";
import { Divider, Loader, Message, Modal, useToaster } from "rsuite";
import { char, number } from "../../../../utils";
import { useReactToPrint } from "react-to-print";
import { hrmsCRUD } from "../../../../actions/hrms";
import moment from "moment";

export const SalarySlip = (props) => {
  const { open, setOpen, dataId, staffId } = props;
  const dataRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dataId && staffId) {
      setLoading(true);
      setTimeout(() => {
        hrmsCRUD
          .loadStaffPayrollData({ payrollId: dataId, staffId })
          .then((resp) => {
            setData(resp.data);
          })
          .catch(() => {})
          .finally(() => {
            setLoading(false);
          });
      }, 500);
    }
  }, [staffId, dataId]);

  const handleGeneratePdf = useReactToPrint({
    content: () => dataRef.current,
  });
  

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)} size="lg">
        <Modal.Header>
          <Modal.Title>
            <div className="row">
              <div className="col-md-6 col-sm-12">Salary Slip</div>
              <div className="col-md-6 col-sm-12 d-flex flex-row-reverse">
                <button
                  className="btn btn-soft-success btn-sm waves-effect waves-light"
                  onClick={handleGeneratePdf}
                >
                  <i className="bi bi-printer-fill m-r-5" /> Print
                </button>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Divider />
        <Modal.Body>
          <div
            className="container-fluid pt-3"
            style={{ backgroundColor: "whitesmoke" }}
          >
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div
                    className="card-body"
                    style={{ height: loading ? 250 : "auto" }}
                  >
                    {loading ? (
                      <Loader
                        backdrop
                        size="lg"
                        speed="slow"
                        content="Please wait..."
                        vertical
                      />
                    ) : (
                      <div className="row">
                        <div className="col-12 tableSlip" ref={dataRef}>
                          <div className="">
                            <table className="table table-bordered table-sm">
                              <tbody>
                                <tr>
                                  <td className="text-center" colSpan={3}>
                                    <img
                                      src="assets/images/logo/pbz.jpg"
                                      width={150}
                                      alt=""
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan={3}>
                                    <p className="fs-4 text-center fw-bold">
                                      The People's Bank of Zanzibar Ltd
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan={3}>
                                    <p className="fs-6 fw-bolder text-center">
                                      Salary Slip for Month ended
                                      {" " +
                                        moment(
                                          data?.staff_info?.period,
                                          "M",
                                        ).format("MMMM") +
                                        " " +
                                        data?.staff_info?.year}
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    Full Name
                                    <span className="ps-5 fw-bold">
                                      {data &&
                                        data.staff_info &&
                                        char.toTitleCase(data.staff_info.code) +
                                          "  " +
                                          char.toUpperCase(
                                            data.staff_info.full_name,
                                          )}
                                    </span>
                                  </td>
                                  <td>
                                    OPF No.
                                    <span className="ps-5 fw-bold">
                                      {data && data.staff_info.opf}
                                    </span>
                                  </td>
                                  <td>
                                    Branch
                                    <span className="ps-5 fw-bold">
                                      {char.toUpperCase(
                                        data?.staff_info?.branch_name,
                                      )}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    Tin No.{" "}
                                    <span className="ps-5 fw-bold">
                                      {data?.staff_info
                                        ? data.staff_info.tin_number
                                        : "N/A"}
                                    </span>
                                  </td>
                                  <td>
                                    Pension No.{" "}
                                    <span className="ps-5 fw-bold">
                                      {data?.staff_info
                                        ? data.staff_info.pension_account
                                        : "N/A"}
                                    </span>
                                  </td>
                                  <td>
                                    Customer No.{" "}
                                    <span className="ps-5 fw-bold">
                                      {data?.staff_info
                                        ? data.staff_info.customer_number
                                        : "N/A"}
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <table
                            className="table table-bordered table-sm"
                            style={{ marginTop: -16 }}
                          >
                            <thead>
                              <tr>
                                <th style={{ width: 500 }}>Earnings</th>
                                <th className="text-end">Amount (TZS)</th>
                                <th className="text-end">Amount (TZS)</th>
                                <th className="text-end">Amount (TZS)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={{ width: 500 }}>Basic Salary</td>
                                <td></td>
                                <td className="text-end fw-bold">
                                  {data
                                    ? number.fNumberDoublePoint(
                                        data.salary_summary.basic_salary,
                                      )
                                    : number.fNumberDoublePoint(0)}
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td colSpan={4} className="fw-bold">
                                  Allowances
                                </td>
                              </tr>
                              {data?.allowances?.items?.map((dt, i) => (
                                <tr key={i}>
                                  <td style={{ width: 500 }}>
                                    {char.toTitleCase(dt?.name)}
                                  </td>
                                  <td className="text-end">
                                    {number.fNumberDoublePoint(dt?.amount)}
                                  </td>
                                  <td></td>
                                  <td></td>
                                </tr>
                              ))}
                              <tr>
                                <td
                                  style={{ width: 500 }}
                                  className="fw-bold text-muted"
                                >
                                  Total Allowances
                                </td>
                                <td></td>
                                <td className="text-end fw-bold">
                                  {data
                                    ? number.fNumberDoublePoint(
                                        data?.allowances?.total_amount,
                                      )
                                    : number.fNumberDoublePoint(0)}
                                </td>
                                <td></td>
                              </tr>
                              <tr style={{ borderTop: "1px solid #000" }}>
                                <td
                                  style={{ width: 500 }}
                                  className="fw-bold text-muted"
                                >
                                  Gross Salary
                                </td>
                                <td></td>
                                <td></td>
                                <td className="text-end fw-bold text-success">
                                  {data
                                    ? number.fNumberDoublePoint(
                                        data.salary_summary.gross_salary,
                                      )
                                    : number.fNumberDoublePoint(
                                        data?.salary_summary?.basic_salary +
                                          data?.allowances?.total_amount || 0,
                                      )}
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={4} className="fw-bold">
                                  Statutory Deductions
                                </td>
                              </tr>
                              {data?.statutory_deductions?.items?.map(
                                (dt, i) => (
                                  <tr key={i}>
                                    <td style={{ width: 500 }}>{dt?.name}</td>
                                    <td className="text-end">
                                      {number.fNumberDoublePoint(dt?.amount)}
                                    </td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                ),
                              )}
                              <tr>
                                <td
                                  style={{ width: 500 }}
                                  className="fw-bold text-muted"
                                >
                                  Total Statutory Deductions
                                </td>
                                <td></td>
                                <td className="text-end fw-bold">
                                  {number.fNumberDoublePoint(
                                    data?.statutory_deductions?.total_amount ||
                                      0,
                                  )}
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td colSpan={4} className="fw-bold">
                                  Other Deductions
                                </td>
                              </tr>
                              {data?.deductions?.items?.map((dt, i) => (
                                <tr key={i}>
                                  <td style={{ width: 500 }}>
                                    {char.toTitleCase(dt?.name)}
                                  </td>
                                  <td className="text-end">
                                    {number.fNumberDoublePoint(dt.amount)}
                                  </td>
                                  <td></td>
                                  <td></td>
                                </tr>
                              ))}
                              <tr>
                                <td
                                  style={{ width: 500 }}
                                  className="fw-bold text-muted"
                                >
                                  Total Other Deductions
                                </td>
                                <td></td>
                                <td className="text-end fw-bold">
                                  {data
                                    ? number.fNumberDoublePoint(
                                        data?.deductions?.total_amount,
                                      )
                                    : number.fNumberDoublePoint(0)}
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td
                                  style={{ width: 500 }}
                                  className="fw-bold text-muted"
                                >
                                  Total Deductions
                                </td>
                                <td></td>
                                <td></td>
                                <td className="text-end fw-bold text-danger">
                                  {number.fNumberDoublePoint(
                                    parseFloat(
                                      data?.statutory_deductions?.total_amount,
                                    ) +
                                      parseFloat(
                                        data?.deductions?.total_amount,
                                      ),
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{ width: 500 }}
                                  className="fw-bold text-muted"
                                >
                                  Net Salary
                                </td>
                                <td></td>
                                <td></td>
                                <td className="text-end fw-bold text-success">
                                  {data
                                    ? number.fNumberDoublePoint(
                                        data.salary_summary.net_salary,
                                      )
                                    : number.fNumberDoublePoint(
                                        (data?.salary_summary?.basic_salary ||
                                          0) +
                                          (data?.allowances?.total_amount ||
                                            0) -
                                          (data?.statutory_deductions
                                            ?.total_amount || 0) -
                                          (data?.deductions?.total_amount || 0),
                                      )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Divider style={{ marginTop: -10 }} />
      </Modal>
    </>
  );
};
