import { useEffect, useRef, useState } from "react";
import { Divider, Loader, Message, Modal, useToaster } from "rsuite";
import { char, number } from "../../../../utils";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import { hrmsCRUD } from "../../../../actions/hrms";

export const SalarySlip = (props) => {
  const { open, setOpen, dataId, staffId } = props;
  const dataRef = useRef(null);
  const toaster = useToaster();

  const [payroll, setPayroll] = useState({});
  const [allowance, setAllowance] = useState([]);
  const [deduction, setDeduction] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dataId && staffId) {
      setLoading(true);
      setTimeout(() => {
        hrmsCRUD
          .loadStaffPayroll(dataId, staffId)
          .then((resp) => {
            setPayroll(resp.data[0]);
          })
          .catch((error) => {
            toaster.push(
              <Message showIcon type={"error"} closable>
                {error.message}
              </Message>,
              { placement: "topCenter", duration: 7000 }
            );
          })
          .finally(() => {
            setLoading(false);
          });
      }, 500);
    }
  }, [dataId, staffId]);

  useEffect(() => {
    if (payroll.year && payroll.month) {
      setLoading(true);
      setTimeout(() => {
        hrmsCRUD
          .loadStaffMonthlyAllowance(staffId, payroll.month, payroll.year, "id")
          .then((resp) => {
            setAllowance(resp.data);
          })
          .catch(() => {})
          .finally(() => {
            setLoading(false);
          });
        hrmsCRUD
          .loadStaffMonthlyDeduction(staffId, payroll.month, payroll.year, "id")
          .then((resp) => {
            setDeduction(resp.data);
          })
          .catch(() => {})
          .finally(() => {
            setLoading(false);
          });
      }, 500);
    }
  }, [staffId, dataId, payroll]);

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
                            <table className="table table-bordered table-sm p5">
                              <tbody>
                                <tr>
                                  <td className="text-center" colSpan={2}>
                                    <img
                                      src="assets/images/logo/pbz.jpg"
                                      width={150}
                                      alt=""
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan={2}>
                                    <p className="fs-4 text-center fw-bold">
                                      The People's Bank of Zanzibar Ltd
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan={2}>
                                    <p className="fs-6 fw-bolder text-center">
                                      Salary Slip for Month ended
                                      {" " +
                                        moment(payroll.month, "M").format(
                                          "MMMM"
                                        ) +
                                        " " +
                                        payroll.year}
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Full Name</td>
                                  <td className="ps-5 fw-bold">
                                    {payroll &&
                                      payroll.staff &&
                                      char.toTitleCase(payroll.staff.code) +
                                        ".  " +
                                        char.toUpperCase(
                                          payroll.staff.full_name
                                        )}
                                  </td>
                                </tr>
                                <tr>
                                  <td>OPF No.</td>
                                  <td className="ps-5 fw-bold">
                                    {payroll &&
                                      payroll.staff &&
                                      payroll.staff.staff_opf}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Branch</td>
                                  <td className="ps-5 fw-bold">
                                    {char.toUpperCase("head office")}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Tin No.</td>
                                  <td className="ps-5 fw-bold">15673</td>
                                </tr>
                                <tr>
                                  <td>Pension No.</td>
                                  <td className="ps-5 fw-bold">1837323</td>
                                </tr>
                                <tr>
                                  <td>Account No.</td>
                                  <td className="ps-5 fw-bold">893659</td>
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
                                  {payroll
                                    ? number.fNumberDoublePoint(
                                        payroll.basic_salary
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
                              {allowance.map((dt, i) => (
                                <tr key={i}>
                                  <td style={{ width: 500 }}>
                                    {char.toTitleCase(dt.allowance.name)}
                                  </td>
                                  <td className="text-end">
                                    {number.fNumberDoublePoint(dt.amount)}
                                  </td>
                                  <td></td>
                                  <td></td>
                                </tr>
                              ))}
                              <tr>
                                <td style={{ width: 500 }}>Total Allowances</td>
                                <td></td>
                                <td className="text-end fw-bold">
                                  {payroll
                                    ? number.fNumberDoublePoint(
                                        payroll.total_allowance
                                      )
                                    : number.fNumberDoublePoint(0)}
                                </td>
                                <td></td>
                              </tr>
                              <tr style={{ borderTop: "1px solid #000" }}>
                                <td style={{ width: 500 }} className="fw-bold">
                                  Gross Salary
                                </td>
                                <td></td>
                                <td></td>
                                <td className="text-end fw-bold text-success">
                                  {number.fNumberDoublePoint(
                                    parseFloat(payroll.basic_salary) +
                                      parseFloat(payroll.total_allowance)
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={4} className="fw-bold">
                                  Statutory Deductions
                                </td>
                              </tr>
                              <tr>
                                <td style={{ width: 500 }}>
                                  Pension Contribution
                                </td>
                                <td className="text-end">
                                  {payroll
                                    ? number.fNumberDoublePoint(
                                        payroll.security_fund
                                      )
                                    : number.fNumberDoublePoint(0)}
                                </td>
                                <td></td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ width: 500 }}>Tax</td>
                                <td className="text-end">
                                  {payroll
                                    ? number.fNumberDoublePoint(payroll.payee)
                                    : number.fNumberDoublePoint(0)}
                                </td>
                                <td></td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ width: 500 }}>
                                  Total Statutory Deductions
                                </td>
                                <td></td>
                                <td className="text-end fw-bold">
                                  {number.fNumberDoublePoint(
                                    parseFloat(payroll.security_fund) +
                                      parseFloat(payroll.payee)
                                  )}
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td colSpan={4} className="fw-bold">
                                  Other Deductions
                                </td>
                              </tr>
                              {deduction.map((dt, i) => (
                                <tr>
                                  <td style={{ width: 500 }}>
                                    {dt.organization
                                      ? char.toTitleCase(dt.organization.name)
                                      : char.toTitleCase(dt.deduction.name)}
                                  </td>
                                  <td className="text-end">
                                    {number.fNumberDoublePoint(dt.amount)}
                                  </td>
                                  <td></td>
                                  <td></td>
                                </tr>
                              ))}
                              <tr>
                                <td style={{ width: 500 }}>
                                  Total Other Deductions
                                </td>
                                <td></td>
                                <td className="text-end fw-bold">
                                  {payroll
                                    ? number.fNumberDoublePoint(
                                        payroll.total_deduction
                                      )
                                    : number.fNumberDoublePoint(0)}
                                </td>
                                <td></td>
                              </tr>
                              <tr>
                                <td style={{ width: 500 }} className="fw-bold">
                                  Total Deductions
                                </td>
                                <td></td>
                                <td></td>
                                <td className="text-end fw-bold text-danger">
                                  {number.fNumberDoublePoint(
                                    parseFloat(payroll.security_fund) +
                                      parseFloat(payroll.payee) +
                                      parseFloat(payroll.total_deduction)
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td style={{ width: 500 }} className="fw-bold">
                                  Net Salary
                                </td>
                                <td></td>
                                <td></td>
                                <td className="text-end fw-bold text-success">
                                  {payroll
                                    ? number.fNumberDoublePoint(
                                        payroll.net_salary
                                      )
                                    : number.fNumberDoublePoint(0)}
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
