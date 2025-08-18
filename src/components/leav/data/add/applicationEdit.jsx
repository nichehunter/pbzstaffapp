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

const branchSchema = Yup.object().shape({
  start_date: Yup.date().required("This field is required"),
  end_date: Yup.date().required("This field is required"),
});

const initialValues = {
  start_date: "",
  end_date: "",
};

const { beforeToday } = DateRangePicker;

export const LeaveApplicationEdit = (props) => {
  const { open, setOpen, index, setIndex, dataId } = props;
  const toaster = useToaster();
  const [leave, setLeave] = useState(null);
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dataId) {
        setLoading(true);
      setTimeout(() => {
        hrmsCRUD
          .loadLeaveDeetails(dataId)
          .then((resp) => {
            setLeave(resp.data);
          })
          .catch(() => {})
          .finally(() => {setLoading(false)});
      },500)
    }
  },[dataId])

  const formik = useFormik({
    initialValues,
    validationSchema: branchSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const { start_date, end_date } = values;
      const data = {
        start_date,
        end_date,
        return_date: returnDate?.date,
        staff: leave?.staff.id,
        leave_type: leave?.leave_type.id,
        working_days: days,
        total_days: moment(end_date).diff(start_date, "days") + 1,
        reason: leave?.reason,
        year: leave?.year,
        status: 46,
      };

      console.log(data);

      setLoading(true);
      setTimeout(() => {
          hrmsCRUD
            .addLeaveChanges(dataId, data)
            .then((resp) => {
              toaster.push(
                <Message showIcon type={"success"} closable>
                  Thank you....! leave application has been updated.
                </Message>,
                { placement: "topCenter", duration: 7000 }
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
                { placement: "topCenter", duration: 7000 }
              );
            });
        
      }, 2000);
    },
  });

  useEffect(() => {
    if (formik.values.start_date && formik.values.end_date) {
      setReturnDate(
        calculateReturnDate(formik.values.start_date, formik.values.end_date)
      );
    }
  }, [formik.values.start_date, formik.values.end_date]);

  useEffect(() => {
    if (formik.values.start_date && formik.values.end_date) {
      const dayList = matters.countBusinessDays(
        formik.values.start_date,
        formik.values.end_date
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
    if (leave?.leave_type.id === 1) {
      if (balance - days <= -1) {
        setStartError(true);
      } else {
        setStartError(false);
      }
    }
  }, [leave, balance, days]);

  useEffect(() => {
    if (leave?.staff.id) {
      setBalance(0);
      setTimeout(() => {
        if (leave?.leave_type.id) {
          hrmsCRUD
            .loadLeaveBalance(
              2,
              0,
              leave?.staff.id,
              leave?.leave_type.id,
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
        hrmsCRUD
          .loadHoliday(50, 0, true, "", "id")
          .then((resp) => {
            setHoliday(
              resp.data.results.map((dt) => {
                return dt.date;
              })
            );
          })
          .catch(() => ({}));
      }, 500);
    }
  }, [leave, open, leave?.leave_type.id]);

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)} size="lg">
        <Modal.Header>
          <Modal.Title>Edit Applicaton</Modal.Title>
        </Modal.Header>
        <Divider />
        <form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <div className="container">
              <div className="row">
                
                <div className="col-md-6 col-sm-12">
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
                          moment(e[0]).format("yyyy-MM-DD")
                        );
                        formik.setFieldValue(
                          "end_date",
                          moment(e[1]).format("yyyy-MM-DD")
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
                <div className="col-md-3 col-sm-12">
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
                <div className="col-md-3 col-sm-12">
                  <div className="form-group text-center">
                    <label className="text-body mb-2">Balance</label>
                    <br />
                    {leave?.leave_type.id === 1 ? (
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
                    {leave?.leave_type.id === 1 && balance - days <= -1 && (
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
              {!loading && leave?.leave_type.id !== 1
                ? leave?.leave_type.id !== "" && (
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
                          {leave?.leave_type.id !== 1
                            ? leave?.leave_type.id !== "" &&
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
