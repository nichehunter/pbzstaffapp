import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Divider, Loader, Modal } from "rsuite";
import { hrmsCRUD } from "../../../../actions/hrms";
import { char, number } from "../../../../utils";
import { selector } from "../../../../api";
import { use } from "i18next";


export const LeaveApplicationPrint = (props) => {
    const { open, setOpen, dataId } = props;

    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState(0);
    const [data, setData] = useState(null);
    const [head, setHead] = useState(null);
    const user = selector.User();   

    const dataRef = useRef(null);

    useEffect(() => {
    if(data){
        hrmsCRUD
            .loadLeaveBalance(
            2,
            0,
            data?.staff?.id,
            data?.leave_type?.id,
            false,
            false,
            "",
            "-id"
            )
            .then((resp) => {
            setBalance(
                resp.data.results
                ?.map((dt) => dt.balance)
                .reduce((a, b) => a + b)
            );
            })
            .catch(() => ({}));
        
    }
    },[data])

    useEffect(() => {
        if(dataId){
            setLoading(true);
            setTimeout(() => {
              hrmsCRUD
                .loadLeaveDeetails(dataId)
                .then((resp) => {
                  setData(resp.data);
                })
                .catch((error) => {})
                .finally(() => {
                  setLoading(false);
                });
            }, 500);
        }
    },[dataId])

    useEffect(() => {
        if (data?.leave_approve[0]) {
          hrmsCRUD.loadStaffData(data?.leave_approve[0]?.approved_by?.staff_opf).then((resp) => {
            setHead(resp.data);
          })
        }
    },[data])


    

    const handleGeneratePdf = useReactToPrint({
      content: () => dataRef.current,
    });

    return (
      <>
        <Modal open={open} onClose={() => setOpen(false)} size="lg">
          <Modal.Header>
            <Modal.Title>
              <div className="row">
                <div className="col-md-6 col-sm-12">Leave Letter</div>
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
                          size="md"
                          speed="slow"
                          center
                          backdrop
                          style={{ color: "orange" }}
                          content="Please wait..."
                          vertical
                        />
                      ) : (
                        <>
                          <div ref={dataRef} className="p-5">
                            <div
                              className="header"
                              style={{
                                textAlign: "center",
                                marginBottom: "20px",
                                marginTop: "-20px",
                              }}
                            >
                              <p style={{ textAlign: "center" }} className="h5">
                                THE PEOPLE'S BANK OF ZANZIBAR LIMITED
                              </p>
                              <p className="fst-italic h5 fs-10">
                                {"(Incorporated in Zanzibar, Tanzania)"}
                              </p>
                              <div className="row">
                                <div className="col-1 me-4"></div>
                                <div className="col-2 mt-2">
                                  <img
                                    src="assets/images/logo/pbz1.png"
                                    alt="logo"
                                    style={{ width: "120px", marginLeft: -50 }}
                                  />
                                </div>
                                <div className="col-8">
                                  <div className="row">
                                    <div className="col-12">
                                      <p
                                        className="h5 fs-14"
                                        style={{ marginLeft: -180 }}
                                      >
                                        Head Office
                                      </p>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div
                                      className="col-3"
                                      style={{
                                        textAlign: "left",
                                        fontSize: 12,
                                        lineHeight: 0.8,
                                      }}
                                    >
                                      <p>Mpirani</p>
                                      <p>P.O.Box 1173</p>
                                      <p>Zanzibar.</p>
                                    </div>
                                    <div className="col-3"></div>
                                    <div
                                      className="col-6"
                                      style={{
                                        textAlign: "left",
                                        fontSize: 12,
                                        lineHeight: 0.8,
                                      }}
                                    >
                                      <p>Tel. +255 24 2231118920</p>
                                      <p>Facsimile.+255 24 2231121</p>
                                      <p>E-mail: info@pbzbank.co.tz</p>
                                      <p>Website: www.pbzbank.co.tz</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <hr style={{ border: "2px solid yellow" }} />
                            <div className="dataPrint">
                              <p className="h5 fs-15 fw-light">
                                PBZ/OPF/{data?.staff?.staff_opf}
                              </p>
                              <p className="h5 fs-15 fw-light">
                                {data &&
                                  char.toTitleCase(data?.staff?.code) +
                                    " " +
                                    char.toUpperCase(data?.staff?.full_name)}
                              </p>
                              <p className="h5 fs-15 fw-light">
                                {user && char.toUpperCase(user.branch_name)}
                              </p>
                              <p className="h5 fs-15 fw-light">
                                THE PEOPLE'S BANK OF ZANZIBAR LTD
                              </p>
                              <p className="h5 fs-4 mt-3 fw-bold text-center">
                                RE:{" "}
                                {data &&
                                  char.toUpperCase(data?.leave_type?.name)}{" "}
                                APPROVAL
                              </p>
                              <p className="mt-3 fs-15 text-justify">
                                Kindly refer to your request dated
                                <span className="fst-italic fw-bold">
                                  {data &&
                                    moment(data?.recorded_at).format(
                                      " MMMM DD, YYYY"
                                    )}
                                </span>
                                , regarding the matter referenced above.
                              </p>
                              <p className="mt-2 fs-15 lh-base text-justify">
                                The People’s Bank of Zanzibar Ltd is pleased to
                                provide you with an update on the current status
                                of your annual leave entitlement, including the
                                balance remaining for this year, as detailed
                                below:
                              </p>
                              <p>
                                <ul className="lh-lg fs-15">
                                  <li>
                                    Total annual leave for the year{" "}
                                    {data && data?.year}:{" "}
                                    <span className="fw-bold">
                                      {data ? number.fNumber(balance) : 0} days
                                    </span>
                                    .
                                  </li>
                                  <li>
                                    {data &&
                                      char.toUpperCaseFirst(
                                        data?.leave_type?.name
                                      )}{" "}
                                    granted :{" "}
                                    <span className="fw-bold">
                                      {data
                                        ? number.fNumber(data?.working_days)
                                        : 0}{" "}
                                      days
                                    </span>
                                    .
                                  </li>
                                  <li>
                                    Remaining{" "}
                                    {data &&
                                      char.toLowerCase(
                                        data?.leave_type?.name
                                      )}{" "}
                                    balance as at {data && data?.year}:{" "}
                                    <span className="fw-bold">
                                      {data
                                        ? number.fNumber(
                                            balance - data?.working_days
                                          )
                                        : 0}{" "}
                                      days
                                    </span>
                                    .
                                  </li>
                                </ul>
                              </p>
                              <p className="mt-3 fs-15 lh-lg text-justify">
                                In accordance with the above, your approved
                                leave period will start on{" "}
                                <span className="fst-italic fw-bold">
                                  {data &&
                                    moment(data?.start_date).format(
                                      " MMMM DD, YYYY"
                                    )}
                                </span>
                                , and terminate on{" "}
                                <span className="fst-italic fw-bold">
                                  {data &&
                                    moment(data?.end_date).format(
                                      " MMMM DD, YYYY"
                                    )}
                                </span>
                                . You are expected to report back to your duty
                                station on
                                <span className="fst-italic fw-bold">
                                  {data &&
                                    moment(data?.return_date).format(
                                      " MMMM DD, YYYY"
                                    )}
                                </span>
                                , to resume your duties.
                              </p>
                              <p className="mt-2 fs-15 lh-base text-justify">
                                The management of PBZ, along with all staff,
                                extends its best wishes for a restful and
                                pleasant leave. We hope you will return to your
                                duties refreshed and ready to continue your
                                valuable contributions.
                              </p>
                              <p className="mt-3 fs-15">Thank you,</p>
                              <p
                                className="fs-15 fw-bold"
                                style={{ marginTop: 50 }}
                              >
                                {data?.leave_approve &
                                  char.toTitleCase(
                                    data?.leave_approve[0]?.approved_by?.code
                                  ) +
                                    " " +
                                    char.toUpperCase(
                                      data?.leave_approve[0]?.approved_by
                                        ?.full_name
                                    )}
                              </p>
                              <p className="mt-2 fs-13 fw-bold">
                                {head &&
                                  char.toUpperCase(
                                    head?.active_departments[0]?.title
                                      ?.dictionary_item_name
                                  )}
                              </p>
                              <p className="mt-2 fs-12 fst-italic">
                                Date : {moment().format("MMMM DD, YYYY")}
                              </p>
                            </div>
                            <div
                              className="mt-3"
                              style={{
                                bottom: 0,
                                width: "100%",
                                textAlign: "center",
                                borderTop: "2px solid yellow",
                                padding: "10px",
                                fontFamily: "Arial, sans-serif",
                                color: "lightblue",
                              }}
                            >
                              <p>The People's Bank. The People's Choice</p>
                            </div>
                          </div>
                        </>
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

}