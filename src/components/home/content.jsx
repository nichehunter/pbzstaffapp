import { useState } from "react";
import moment from "moment";
import { selector } from "../../api";
import { char, code, greeting, number } from "../../utils";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export const HomeContent = () => {
  const staff = selector.Staff();
  const [count, setCount] = useState({});
  const [countLoading, setCountLoading] = useState(false);

  return (
    <>
      <div className="container-fluid">
        <div className="row mb-2" style={{ marginTop: -35 }}>
          <div className="col-12">
            <p className="h5 text-dark" style={{ marginTop: -47 }}>
              {greeting.generateGreetings()}. &nbsp;{" "}
              {staff
                ? staff.full_name
                  ? char.toTitleCase(code.getFirstWord(staff.full_name))
                  : null
                : null}
              !
            </p>
            <p className="fs-12 mb-0 text-muted">
              Today is{" "}
              <span className="fw-bold">
                {moment(new Date()).format("dddd, DD MMMM YYYY")}
              </span>
              .
            </p>
          </div>
          <hr className="mt-3" />
        </div>
        <>
          <div className="row project-wrapper">
            <div className="col-xxl-8">
              <div className="row">
                <div className="col-xl-4">
                  <div className="card card-animate">
                    {countLoading ? (
                      <div className="text-center mt-4 mb-4">
                        <Spin
                          indicator={
                            <LoadingOutlined
                              style={{
                                fontSize: 24,
                              }}
                              spin
                            />
                          }
                        />
                      </div>
                    ) : (
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1 overflow-hidden">
                            <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                              {" "}
                              Leave Balance
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-end justify-content-between mt-4">
                          <div className="text-dark">
                            <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                              <span className="counter-value">
                                {count
                                  ? number.fShortenNumber(count.staff)
                                  : "0.0"}
                              </span>
                            </h4>
                          </div>
                          <div className="avatar-sm flex-shrink-0">
                            <span className="avatar-title bg-soft-success rounded fs-3">
                              <i className="bx bx-user text-success" />
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="card card-animate">
                    {countLoading ? (
                      <div className="text-center mt-4 mb-4">
                        <Spin
                          indicator={
                            <LoadingOutlined
                              style={{
                                fontSize: 24,
                              }}
                              spin
                            />
                          }
                        />
                      </div>
                    ) : (
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1 overflow-hidden">
                            <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                              {" "}
                              total assets
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-end justify-content-between mt-4">
                          <div className="text-dark">
                            <h4 className="fs-22 fw-semibold ff-primary mb-4">
                              <span className="counter-value">
                                {count
                                  ? number.fShortenNumber(count.branch)
                                  : "0.0"}
                              </span>
                            </h4>
                          </div>
                          <div className="avatar-sm flex-shrink-0">
                            <span className="avatar-title bg-soft-primary rounded fs-3">
                              <i className="bi bi-bank text-primary" />
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="card card-animate">
                    {countLoading ? (
                      <div className="text-center mt-4 mb-4">
                        <Spin
                          indicator={
                            <LoadingOutlined
                              style={{
                                fontSize: 24,
                              }}
                              spin
                            />
                          }
                        />
                      </div>
                    ) : (
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1 overflow-hidden">
                            <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                              {" "}
                              total unit
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-end justify-content-between mt-4">
                          <div className="text-dark">
                            <h4 className="fs-22 fw-semibold ff-info mb-4">
                              <span className="counter-value">
                                {/* {count
                                  ? number.fShortenNumber(count.unit)
                                  : "0.0"} */}
                                10
                              </span>
                            </h4>
                          </div>
                          <div className="avatar-sm flex-shrink-0">
                            <span className="avatar-title bg-soft-info rounded fs-3">
                              <i className="bi bi-unity text-info" />
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* end row */}
              {/* <StaffDepartmentSummary /> */}
              {/* end row */}
            </div>
            {/* <StaffSummary /> */}
          </div>
          {/* end row */}
        </>
      </div>
    </>
  );
};
