import moment from "moment";
import { char, number } from "../utils";
import { Spin } from "antd";

export const TransactionTable = (props) => {
  const {
    account,
    info,
    debit,
    credit,
    setOpen,
    setTransactOpen,
    loading,
    setJournal,
    setTransact,
  } = props;

  const handleControl = (e, i) => {
    if (i === "journal") {
      setJournal(e);
      setTransact(null);
    } else if (i === "invoice") {
      setJournal(null);
      setTransact(e);
    }
  };

  return (
    <>
      {loading ? (
        <Spin fullscreen={true} size="large" />
      ) : (
        <div className="container-fluid top-0">
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                {account === "customer" ? (
                  <h5 className="text-center text-color">
                    {info.customer &&
                      char.toUpperCase(info.account_code) +
                        " | " +
                        char.toTitleCase(info.customer.name)}
                  </h5>
                ) : account === "institution" ? (
                  <h5 className="text-center text-color">
                    {info.collection_center && char.toUpperCase(info.account_code) + " | " + char.toTitleCase(info.name)}
                  </h5>
                ) : debit.length ? (
                  <h5 className="text-center text-color">
                    {debit[0].account && debit[0].account.account_code}
                  </h5>
                ) : credit.length ? (
                  <h5 className="text-center text-color">
                    {credit[0].account && credit[0].account.account_code}
                  </h5>
                ) : null}
                <hr />
                <div className="tableRow" style={{ marginTop: -30 }}>
                  <div className="tableColumn">
                    <table className="table mt-4 table-bordered table-sm">
                      <thead className="table-head">
                        <tr>
                          <th>#</th>
                          <th>Date</th>
                          <th>Description</th>
                          <th className="text-center">Dr</th>
                        </tr>
                      </thead>
                      <tbody>
                        {debit?.map((dt, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td style={{ width: 200 }}>
                              <button
                                className="btn btn-sm btn-rounded btn-link"
                                onClick={() => {
                                  setOpen(false);
                                  setTransactOpen(true);
                                  handleControl(
                                    dt.journaltransaction
                                      ? dt.journaltransaction.journal
                                      : dt.invoicetransaction
                                      ? dt.invoicetransaction.invoice
                                      : null,
                                    dt.journaltransaction
                                      ? "journal"
                                      : dt.invoicetransaction
                                      ? "invoice"
                                      : null
                                  );
                                }}
                              >
                                {dt.created_at
                                  ? moment(dt.created_at).format(
                                      "ddd  DD  MMMM YYYY"
                                    )
                                  : "N/A"}
                              </button>
                            </td>
                            <td className="text-start">
                              {dt.description ? dt.description : "N/A"}
                            </td>
                            <td className="text-end">
                              {dt.equivalent_amount
                                ? number.fNumberDoublePoint(
                                    dt.equivalent_amount
                                  )
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="tableColumn">
                    <table className="table mt-4 table-bordered table-sm">
                      <thead className="table-head">
                        <tr>
                          <th className="text-center">#</th>
                          <th>Date</th>
                          <th>Description</th>
                          <th className="text-center">Cr</th>
                        </tr>
                      </thead>
                      <tbody>
                        {credit?.map((dt, i) => (
                          <tr key={i}>
                            <td className="text-center">{i + 1}</td>
                            <td style={{ width: 200 }}>
                              <button
                                className="btn btn-sm btn-rounded btn-link"
                                onClick={() => {
                                  setOpen(false);
                                  setTransactOpen(true);
                                  handleControl(
                                    dt.journaltransaction
                                      ? dt.journaltransaction.journal
                                      : dt.invoicetransaction
                                      ? dt.invoicetransaction.invoice
                                      : null,
                                    dt.journaltransaction
                                      ? "journal"
                                      : dt.invoicetransaction
                                      ? "invoice"
                                      : null
                                  );
                                }}
                              >
                                {dt.created_at
                                  ? moment(dt.created_at).format(
                                      "ddd  DD  MMMM YYYY"
                                    )
                                  : "N/A"}
                              </button>
                            </td>
                            <td className="text-start">
                              {dt.description ? dt.description : "N/A"}
                            </td>
                            <td className="text-end">
                              {dt.equivalent_amount
                                ? number.fNumberDoublePoint(
                                    dt.equivalent_amount
                                  )
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="tableRow">
                  <div className="tableColumn">
                    <table
                      className="table table-bordered table-sm"
                      style={{ marginTop: -15 }}
                    >
                      <tbody>
                        <tr>
                          <td colSpan={3}></td>
                          <td
                            className="text-end fw-bold"
                            style={{ width: 183 }}
                          >
                            {number.fNumberDoublePoint(
                              debit.reduce(
                                (a, b) => a + +b.equivalent_amount,
                                0
                              )
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="tableColumn">
                    <table
                      className="table table-bordered table-sm"
                      style={{ marginTop: -15 }}
                    >
                      <tbody>
                        <tr>
                          <td colSpan={3}></td>
                          <td
                            className="text-end fw-bold"
                            style={{ width: 183 }}
                          >
                            {number.fNumberDoublePoint(
                              credit.reduce(
                                (a, b) => a + +b.equivalent_amount,
                                0
                              )
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="tableRow">
                  <table
                    className="table table-bordered table-sm"
                    style={{ marginTop: -20 }}
                  >
                    <tbody>
                      <tr>
                        <td colSpan={3}></td>
                        {account === "institution" ? (
                          <td
                            className={
                              debit.reduce(
                                (a, b) => a + +b.equivalent_amount,
                                0
                              ) >
                              credit.reduce(
                                (a, b) => a + +b.equivalent_amount,
                                0
                              )
                                ? "text-end fw-bold text-success"
                                : "text-end fw-bold"
                            }
                            style={{ width: 183 }}
                          >
                            {debit.reduce(
                              (a, b) => a + +b.equivalent_amount,
                              0
                            ) >
                            credit.reduce((a, b) => a + +b.equivalent_amount, 0)
                              ? number.fNumberDoublePoint(
                                  debit.reduce(
                                    (a, b) => a + +b.equivalent_amount,
                                    0
                                  ) -
                                    credit.reduce(
                                      (a, b) => a + +b.equivalent_amount,
                                      0
                                    )
                                )
                              : null}
                          </td>
                        ) : (
                          <td
                            className={
                              debit.reduce(
                                (a, b) => a + +b.equivalent_amount,
                                0
                              ) >
                              credit.reduce(
                                (a, b) => a + +b.equivalent_amount,
                                0
                              )
                                ? "text-end fw-bold text-danger"
                                : "text-end fw-bold"
                            }
                            style={{ width: 183 }}
                          >
                            {debit.reduce(
                              (a, b) => a + +b.equivalent_amount,
                              0
                            ) >
                            credit.reduce((a, b) => a + +b.equivalent_amount, 0)
                              ? number.fNumberDoublePoint(
                                  debit.reduce(
                                    (a, b) => a + +b.equivalent_amount,
                                    0
                                  ) -
                                    credit.reduce(
                                      (a, b) => a + +b.equivalent_amount,
                                      0
                                    )
                                )
                              : null}
                          </td>
                        )}
                        <td colSpan={3}></td>
                        {account === "institution" ? (
                          <td
                            className={
                              credit.reduce(
                                (a, b) => a + +b.equivalent_amount,
                                0
                              ) >
                              debit.reduce(
                                (a, b) => a + +b.equivalent_amount,
                                0
                              )
                                ? "text-end fw-bold text-danger"
                                : "text-end fw-bold"
                            }
                            style={{ width: 183 }}
                          >
                            {credit.reduce(
                              (a, b) => a + +b.equivalent_amount,
                              0
                            ) >
                            debit.reduce((a, b) => a + +b.equivalent_amount, 0)
                              ? number.fNumberDoublePoint(
                                  credit.reduce(
                                    (a, b) => a + +b.equivalent_amount,
                                    0
                                  ) -
                                    debit.reduce(
                                      (a, b) => a + +b.equivalent_amount,
                                      0
                                    )
                                )
                              : null}
                          </td>
                        ) : (
                          <td
                            className={
                              credit.reduce(
                                (a, b) => a + +b.equivalent_amount,
                                0
                              ) >
                              debit.reduce(
                                (a, b) => a + +b.equivalent_amount,
                                0
                              )
                                ? "text-end fw-bold text-success"
                                : "text-end fw-bold"
                            }
                            style={{ width: 183 }}
                          >
                            {credit.reduce(
                              (a, b) => a + +b.equivalent_amount,
                              0
                            ) >
                            debit.reduce((a, b) => a + +b.equivalent_amount, 0)
                              ? number.fNumberDoublePoint(
                                  credit.reduce(
                                    (a, b) => a + +b.equivalent_amount,
                                    0
                                  ) -
                                    debit.reduce(
                                      (a, b) => a + +b.equivalent_amount,
                                      0
                                    )
                                )
                              : null}
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
