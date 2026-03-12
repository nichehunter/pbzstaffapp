import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Modal,
  Divider,
  useToaster,
  Message,
  SelectPicker,
  DatePicker,
  DateRangePicker,
} from "rsuite";
import { selector } from "../../../../api";
import { hrmsCRUD } from "../../../../actions/hrms";
import { calculateReturnDate, char, matters, number } from "../../../../utils";
import moment from "moment";
import { authCRUD } from "../../../../actions/auth";

const branchSchema = Yup.object().shape({
  leave_type: Yup.string().required("This field is required"),
  start_date: Yup.date().required("This field is required"),
  end_date: Yup.date().required("This field is required"),
});

const initialValues = {
  leave_type: "",
  start_date: "",
  end_date: "",
  reason: "",
};

const { beforeToday } = DateRangePicker;

export const LeaveApplicationAdd = (props) => {
  const { open, setOpen, index, setIndex, dataId } = props;
  const user = selector.User();
  const staff = selector.Staff();
  const toaster = useToaster();
  const [leave, setLeave] = useState([]);
  const [leaveType, setLeaveType] = useState([]);
  const [typeSearch, setTypeSearch] = useState("");
  const [leaveDuration, setLeaveDuration] = useState([]);
  const [returnDate, setReturnDate] = useState(null);
  const [startError, setStartError] = useState(null);
  const [balance, setBalance] = useState(0);
  const [days, setDays] = useState(0);
  const [date, setDate] = useState(null);
  const [duration, setDuration] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [hours, setHours] = useState(0);
  const [holiday, setHoliday] = useState([]);
  const [supervisor, setSupervisor] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      hrmsCRUD
        .loadLeaveType(15, 0, typeSearch, "name")
        .then((resp) => {
          setLeaveType(resp.data.results);
        })
        .catch(() => ({}));
      hrmsCRUD
        .loadDictionaryData(15, 0, "", 15)
        .then((resp) => {
          setLeaveDuration(resp.data.results);
        })
        .catch(() => ({}));
    }, 500);
  }, [typeSearch]);

  useEffect(() => {
    if (dataId) {
      setLoading(true);
      setTimeout(() => {
        hrmsCRUD
          .loadLeaveApplication(10, 0, dataId, true, "", "-year")
          .then((resp) => {
            setLeave(resp.data.results);
          })
          .catch((error) => {
            toaster.push(
              <Message showIcon type={"error"} closable>
                {error.message}
              </Message>,
              { placement: "topCenter", duration: 7000 },
            );
          })
          .finally(() => {
            setLoading(false);
          });
      }, 500);
    }
  }, [dataId]);

  const formik = useFormik({
    initialValues,
    validationSchema: branchSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const { start_date, end_date, leave_type, reason } = values;
      const recorded_by = user.username;
      const data = {
        start_date,
        end_date,
        return_date: returnDate?.date,
        staff: dataId,
        leave_type,
        working_days: days,
        total_days: moment(end_date).diff(start_date, "days") + 1,
        reason,
        year: new Date().getFullYear(),
        status: 46,
        recorded_by,
      };

      const dataHREmail = {
        email: "humanresources@pbzbank.co.tz",
        subject: "Leave Request",
        message: `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <p>Dear HR Team,</p>
          <p>
            A new leave request has been initiated by <strong>${char?.toUpperCase(
              user?.first_name + " " + user?.last_name,
            )}</strong> 
            and is pending review by staff's supervisor, 
            <strong>${char.toUpperCase(supervisor?.full_name)}</strong>.
          </p>
          <p>
            For tracking purposes, please log in to the system using the link below:
          </p>
          <p>
            <a href="http://192.168.101.141" style="color: #007BFF; text-decoration: none; font-weight: bold;">
              Click here to track the request
            </a>
          </p>
          <p>Thank you,</p>
        </div>`,
      };

      const dataSupervisorEmail = {
        email: supervisor?.email,
        subject: "Leave Request",
        message: `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <p>Dear ${char.toUpperCase(supervisor?.full_name)},</p>
          <p>
            <strong>${char?.toUpperCase(
              user?.first_name + " " + user?.last_name,
            )}</strong> has submitted a leave request for your review. 
            Please log in to the system to approve, reject, or assign the request to another supervisor.
          </p>
          <p>
            <a href="http://192.168.101.143" style="color: #007BFF; text-decoration: none; font-weight: bold;">
              Click here to manage the request
            </a>
          </p>
          <p>Thank you,</p>
        </div>`,
      };

      const dataStaffEmail = {
        email: user?.email,
        subject: "Leave Request",
        message: `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <p>Dear ${char?.toUpperCase(
          user?.first_name + " " + user?.last_name,
        )},</p>
        <p>
          Your leave request has been successfully submitted and is now pending review by your supervisor, 
          <strong>${char.toUpperCase(supervisor?.full_name)}</strong>.
        </p>
        <p>
          You can track the status of your request by logging in to the system. 
          If your supervisor needs any additional information, they will reach out to you directly.
        </p>
        <p>Thank you,</p>
      </div>`,
      };

      setLoading(true);
      setTimeout(() => {
        if (leave.length >= 1) {
          toaster.push(
            <Message showIcon type={"error"} closable>
              {"Sorry...! Only one leave is allowed to be in process"}
            </Message>,
            { placement: "topCenter", duration: 7000 },
          );
          setLoading(false);
          setOpen(false);
        } else {
          hrmsCRUD
            .addLeaveApplication([data])
            .then((resp) => {
              const leaveId = resp.data[0].id;

              const dataDuration = {
                leave: leaveId,
                duration_type: leave_type !== 1 ? duration : 55,
                start_time: leave_type !== 1 ? startTime : null,
                end_time: leave_type !== 1 ? endTime : null,
                hours: leave_type !== 1 ? number.fNumberDoublePoint(hours) : 0,
                recorded_by,
              };

              const dataAssignment = {
                leave: leaveId,
                assigned_to: supervisor.id,
                assigned_by: staff.id,
                is_active: true,
                recorded_by,
              };

              hrmsCRUD.addLeaveAssignment([dataAssignment]).then(() => {});
              hrmsCRUD.addLeaveDuration([dataDuration]).then(() => {});

              authCRUD
                .sendEmail(dataSupervisorEmail)
                .then(() => {})
                .catch(() => {});

              authCRUD
                .sendEmail(dataHREmail)
                .then(() => {})
                .catch(() => {});

              authCRUD
                .sendEmail(dataStaffEmail)
                .then(() => {})
                .catch(() => {});

              toaster.push(
                <Message showIcon type={"success"} closable>
                  Thank you....! another application has been added.
                </Message>,
                { placement: "topCenter", duration: 7000 },
              );
              setIndex(index + 1);
              resetForm();
              setLoading(false);
              setSubmitting(false);
              setOpen(false);
            })
            .catch((error) => {
              setLoading(false);
              setSubmitting(false);
              toaster.push(
                <Message showIcon type={"error"} closable>
                  {error.message}
                </Message>,
                { placement: "topCenter", duration: 7000 },
              );
            });
        }
      }, 2000);
    },
  });

  useEffect(() => {
    if (formik.values.start_date && formik.values.end_date) {
      setReturnDate(
        calculateReturnDate(formik.values.start_date, formik.values.end_date),
      );
    }
  }, [formik.values.start_date, formik.values.end_date]);

  useEffect(() => {
    if (formik.values.start_date && formik.values.end_date) {
      const dayList = matters.countBusinessDays(
        formik.values.start_date,
        formik.values.end_date,
      );

      let day = 0;

      if (dayList.length >= holiday.length) {
        for (let i = 0; i < dayList.length; i++) {
          if (!holiday.includes(dayList[i])) {
            day++;
          }
        }
      } else {
        for (let i = 0; i < holiday.length; i++) {
          if (!dayList.includes(holiday[i])) {
            day++;
          }
        }
      }
      setDays(day);
    }
  }, [formik.values.start_date, formik.values.end_date]);

  useEffect(() => {
    if (startTime && endTime) {
      var now = moment(endTime, "HH:mm:ss");
      var prev = moment(startTime, "HH:mm:ss");
      setHours(moment.duration(now.diff(prev)).asHours() + 1);
    }
  }, [startTime, endTime]);

  useEffect(() => {
    if (formik.values.leave_type === 1) {
      if (balance - days <= -1) {
        setStartError(true);
      } else {
        setStartError(false);
      }
    }
  }, [formik.values.leave_type, balance, days]);

  useEffect(() => {
    if (dataId) {
      setBalance(0);
      setTimeout(() => {
        if (formik.values.leave_type) {
          hrmsCRUD
            .loadLeaveBalance(
              2,
              0,
              dataId,
              formik.values.leave_type,
              false,
              false,
              "",
              "-id",
            )
            .then((resp) => {
              setBalance(
                resp.data.results
                  ?.map((dt) => dt.balance)
                  .reduce((a, b) => a + b),
              );
            })
            .catch(() => ({}));
        }
        if (user.branch_code === "201") {
          hrmsCRUD
            .loadDepartmentHead(2, 0, user.department_id, true, "", "-id")
            .then((resp) => {
              console.log(resp.data);

              setSupervisor(resp.data.results[0].supervisor.staff);
            });
        } else {
          hrmsCRUD
            .loadBranchManager(2, 0, user.branch_id, true, "", "-id")
            .then((resp) => {
              setSupervisor(resp.data.results[0].supervisor.staff);
            });
        }
        hrmsCRUD
          .loadHoliday(50, 0, true, "", "id")
          .then((resp) => {
            setHoliday(
              resp.data.results.map((dt) => {
                return dt.date;
              }),
            );
          })
          .catch(() => ({}));
      }, 500);
    }
  }, [dataId, open, formik.values.leave_type]);

  useEffect(() => {
    if (supervisor) {
      if (supervisor.staff_opf === parseInt(user.username)) {
        hrmsCRUD.loadBranchManager(1, 0, 1, true, "", "-id").then((resp) => {
          setSupervisor(resp.data.results[0].supervisor.staff);
        });
      }
    }
  }, [supervisor]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} size="lg">
        <Modal.Header>
          <Modal.Title>New Applicaton</Modal.Title>
        </Modal.Header>
        <Divider />
        <form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <div className="container">
              <div className="row">
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="text-body mb-2">
                      Leave type
                      <span className="text-danger">&nbsp;*</span>
                    </label>
                    <SelectPicker
                      data={leaveType?.map((dt) => ({
                        value: dt.id,
                        label: char.toTitleCase(dt.name),
                      }))}
                      placeholder="Select leave"
                      onChange={(e) => {
                        formik.setFieldValue("leave_type", e);
                        setDuration(null);
                      }}
                      onSearch={(e) => {
                        setTypeSearch(e);
                      }}
                      block
                    />
                    {formik.touched.leave_type && formik.errors.leave_type && (
                      <div
                        className="fw-light mt-1"
                        style={{ fontSize: "12px" }}
                      >
                        <span role="alert" className="text-danger">
                          {formik.errors.leave_type}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="text-body mb-2">
                      Choose Date <span className="text-danger">&nbsp;*</span>
                    </label>
                    <DateRangePicker
                      showWeekNumbers={true}
                      placeholder="Select Date Range"
                      cleanable={false}
                      block={true}
                      value={date}
                      onChange={(e) => {
                        setDate(e);
                        formik.setFieldValue(
                          "start_date",
                          moment(e[0]).format("yyyy-MM-DD"),
                        );
                        formik.setFieldValue(
                          "end_date",
                          moment(e[1]).format("yyyy-MM-DD"),
                        );
                      }}
                      shouldDisableDate={beforeToday()}
                    />
                    {formik.touched.start_date && formik.errors.start_date && (
                      <div
                        className="fw-light mt-1"
                        style={{ fontSize: "12px" }}
                      >
                        <span role="alert" className="text-danger">
                          {formik.errors.start_date}
                        </span>
                      </div>
                    )}
                    {returnDate?.error && (
                      <div
                        className="fw-light mt-1"
                        style={{ fontSize: "12px" }}
                      >
                        <span role="alert" className="text-danger">
                          {returnDate?.error}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-2 col-sm-12">
                  <div className="form-group text-center">
                    <label className="text-body mb-2">Working Days</label>
                    <br />
                    <div class="d-grid gap-2">
                      <button className="btn btn-light btn-block">
                        <span className="text-primary">
                          {number.fNumber(days)}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 col-sm-12">
                  <div className="form-group text-center">
                    <label className="text-body mb-2">Balance</label>
                    <br />
                    {formik.values.leave_type === 1 ? (
                      balance - days <= -1 ? (
                        <div class="d-grid gap-2">
                          <button className="btn btn-light btn-block">
                            <span className="text-danger">
                              {number.fNumber(balance - days)}
                            </span>
                          </button>
                        </div>
                      ) : (
                        <div class="d-grid gap-2">
                          <button className="btn btn-light btn-block">
                            <span className="text-success">
                              {number.fNumber(balance - days)}
                            </span>
                          </button>
                        </div>
                      )
                    ) : (
                      <div class="d-grid gap-2">
                        <button className="btn btn-light btn-block">
                          <span className="text-success">
                            {number.fNumber(balance)}
                          </span>
                        </button>
                      </div>
                    )}
                    {formik.values.leave_type === 1 && balance - days <= -1 && (
                      <div
                        className="fw-light mt-1"
                        style={{ fontSize: "12px" }}
                      >
                        <span role="alert" className="text-danger">
                          {"Selected days is more than your balance"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {formik.values.leave_type !== 1
                ? formik.values.leave_type !== "" && (
                    <div className="row mt-3">
                      <div
                        className={
                          duration !== 58 ? "col-12" : "col-md-4 col-sm-12"
                        }
                      >
                        <div className="form-group">
                          <label className="text-body mb-2">
                            Leave Duration
                            <span className="text-danger">&nbsp;*</span>
                          </label>
                          <SelectPicker
                            data={leaveDuration?.map((dt) => ({
                              value: dt.id,
                              label: char.toTitleCase(dt.dictionary_item_name),
                            }))}
                            placeholder="Select duration"
                            onChange={(e) => {
                              setDuration(e);
                            }}
                            block
                          />
                          {formik.values.leave_type !== 1
                            ? formik.values.leave_type !== "" &&
                              !duration && (
                                <div
                                  className="fw-light mt-1"
                                  style={{ fontSize: "12px" }}
                                >
                                  <span role="alert" className="text-danger">
                                    {"This field is required"}
                                  </span>
                                </div>
                              )
                            : null}
                        </div>
                      </div>
                      {duration !== 58 || duration === null ? null : (
                        <>
                          <div className="col-md-3 col-sm-12">
                            <div className="form-group">
                              <label className="text-body mb-2">
                                Start Time
                                <span className="text-danger">&nbsp;*</span>
                              </label>
                              <DatePicker
                                block={true}
                                cleanable={false}
                                format="HH:mm"
                                ranges={[
                                  {
                                    label: "Now",
                                    value: new Date(),
                                  },
                                ]}
                                onChange={(e) => {
                                  setStartTime(moment(e).format("HH:mm:ss"));
                                }}
                              />
                              {duration !== 58 || duration !== null ? (
                                startTime ? null : (
                                  <div
                                    className="fw-light mt-1"
                                    style={{ fontSize: "12px" }}
                                  >
                                    <span role="alert" className="text-danger">
                                      {"This field is required"}
                                    </span>
                                  </div>
                                )
                              ) : null}
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-12">
                            <div className="form-group">
                              <label className="text-body mb-2">
                                End Time
                                <span className="text-danger">&nbsp;*</span>
                              </label>
                              <DatePicker
                                block={true}
                                cleanable={false}
                                format="HH:mm"
                                ranges={[]}
                                onChange={(e) => {
                                  setEndTime(moment(e).format("HH:mm:ss"));
                                }}
                              />
                              {startTime !== "" || startTime !== null ? (
                                endTime ? null : (
                                  <div
                                    className="fw-light mt-1"
                                    style={{ fontSize: "12px" }}
                                  >
                                    <span role="alert" className="text-danger">
                                      {"This field is required"}
                                    </span>
                                  </div>
                                )
                              ) : null}
                            </div>
                          </div>
                          <div className="col-md-2 col-sm-12">
                            <div className="form-group text-center">
                              <label className="text-body mb-2">
                                No. Hours
                              </label>
                              <br />
                              <div class="d-grid gap-2">
                                <button className="btn btn-light btn-block">
                                  <span className="text-primary">
                                    {number.fNumberDoublePoint(hours)}
                                  </span>
                                </button>
                              </div>
                              {formik.touched.end_date &&
                                formik.errors.end_date && (
                                  <div
                                    className="fw-light mt-1"
                                    style={{ fontSize: "12px" }}
                                  >
                                    <span role="alert" className="text-danger">
                                      {formik.errors.end_date}
                                    </span>
                                  </div>
                                )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )
                : null}
              <div className="row mt-3">
                <div className="col-12">
                  <div className="form-group">
                    <label className="text-body mb-2">Comments</label>
                    <textarea
                      rows={5}
                      className="form-control"
                      {...formik.getFieldProps("reason")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Divider style={{ marginTop: -10 }} />
          <Modal.Footer>
            <div className="container">
              <div className="row">
                <div className="col-md-6 col-sm-12 d-flex justify-content-start">
                  <span className="fs-18 text-danger"> * &nbsp;</span> Required
                  field
                </div>
                <div className="col-md-6 col-sm-12 d-flex justify-content-end">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="btn btn-danger me-3"
                  >
                    <span className="bi bi-slash-circle"></span> Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={
                      formik.isSubmitting ||
                      loading ||
                      startError ||
                      returnDate?.error
                    }
                  >
                    {!loading && (
                      <span className="indicator-label">
                        <span className="bi bi-check-circle"></span> Save
                      </span>
                    )}
                    {loading && (
                      <span
                        className="indicator-progress"
                        style={{ display: "block" }}
                      >
                        Please wait...
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
