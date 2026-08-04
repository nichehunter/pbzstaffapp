import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Modal, Divider, useToaster, DatePicker, Message } from "rsuite";
import { selector } from "../../../api";
import { Input, Select, Switch } from "antd";
import { char } from "../../../utils";
import moment from "moment";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { riskCRUD } from "../../../actions/risk";
import { hrmsCRUD } from "../../../actions/hrms";

const incidenceSchema = Yup.object().shape({
  instance: Yup.string().required("This field is required"),
  priority: Yup.string().required("This field is required"),
  subject: Yup.string()
    .max(100, "Subject must not be more than 100 characters")
    .required("This field is required"),
  root: Yup.string()
    .max(100, "Root causes must not be more than 100 characters")
    .required("This field is required"),
  department: Yup.string().required("This field is required"),
  description: Yup.string().max(
    500,
    "Description must not be more than 500 characters",
  ),
  start_time: Yup.date()
    .max(
      new Date(new Date().setHours(0, 0, 0, 0)),
      "Start date must not be more than today",
    )
    .required("This field is required"),
  end_time: Yup.date().min(
    Yup.ref("start_time"),
    "end date must be more than start date",
  ),
});

const initialValues = {
  priority: "",
  instance: "",
  department: "",
  subDepartment: "",
  subject: "",
  description: "",
  root: "",
  financial_loss: "",
  non_financial_loss: "",
  start_time: "",
  end_time: "",
  is_financial_loss: false,
  status: "pending",
};

dayjs.extend(customParseFormat);

export const IncidenceAdd = (props) => {
  const { RangePicker } = DatePicker;
  const dateFormat = "YYYY-MM-DD";
  const { TextArea } = Input;
  const { open, setOpen, index, setIndex } = props;
  const user = selector.User();
  const staff = selector.Staff();
  const [incidenceSearch, setIncidenceSearch] = useState("");
  const [incidence, setIncidence] = useState([]);
  const [department, setDepartment] = useState([]);
  const [subDepartment, setSubDepartment] = useState([]);
  const [dataDept, setDataDept] = useState("");
  const [staffDept, setStaffDept] = useState("");
  const toaster = useToaster();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      riskCRUD
        .loadRiskDictionaryData(20, 0, incidenceSearch, 1)
        .then((resp) => {
          setIncidence(resp.data.results);
        })
        .catch(() => {});
    }, 2000);
  }, [incidenceSearch]);

  useEffect(() => {
    setTimeout(() => {
      hrmsCRUD.loadStaffBranch(1, 0, staff.id, true, "", "").then((resp) => {
        if (resp.data.results[0].branch.branch_code === "201") {
          setStaffDept(resp.data.results[0].department.department_name);
        } else {
          setStaffDept(resp.data.results[0].branch.branch_name);
        }
      });
    }, 2000);
  }, [staff]);

  const formik = useFormik({
    initialValues,
    validationSchema: incidenceSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const {
        priority,
        instance,
        subject,
        description,
        root,
        financial_loss,
        non_financial_loss,
        start_time,
        end_time,
        is_financial_loss,
        status,
        subDepartment,
        department,
      } = values;

      const data = {
        priority,
        instance,
        subject,
        description,
        root,
        financial_loss,
        non_financial_loss,
        start_time,
        end_time: end_time ? end_time : start_time,
        is_financial_loss,
        branch_department: staffDept,
        reported_name: dataDept,
        reported_id: subDepartment ? subDepartment : department,
        recorder_name: staff.full_name,
        recorded_by: user.username,
        status,
      };

      setLoading(true);
      setTimeout(() => {
        riskCRUD
          .addIncidence([data])
          .then(() => {
            toaster.push(
              <Message showIcon type={"success"} closable>
                Thank you....! another incidence has been reported.
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
            const responseData = error?.response?.data;
            let errorMessage = "Something went wrong. Please try again.";

            if (typeof responseData === "string") {
              errorMessage = responseData;
            } else if (responseData?.error) {
              errorMessage = responseData.error;
            } else if (responseData?.detail) {
              errorMessage = responseData.detail;
            } else if (responseData?.message) {
              errorMessage = responseData.message;
            } else if (typeof responseData === "object") {
              const firstKey = Object.keys(responseData)[0];
              const firstError = responseData[firstKey];
              if (Array.isArray(firstError)) {
                errorMessage = `${firstError[0]}`;
              }
            }
            setLoading(false);
            setSubmitting(false);
            toaster.push(
              <Message showIcon type={"error"} closable>
                {errorMessage}
              </Message>,
              { placement: "topCenter", duration: 7000 },
            );
          });
      }, 2000);
    },
  });

  useEffect(() => {
    setTimeout(() => {
      hrmsCRUD
        .loadDepartmentByCode(
          formik.values.instance === 13
            ? ["ict", "dhra"]
            : formik.values.instance === 10 || formik.values.instance === 11
              ? ["ict", "dhra", "hbo"]
              : formik.values.instance === 14 || formik.values.instance === 25
                ? ["ict", "dhra", "doc"]
                : formik.values.instance === 15
                  ? ["dhra", "doc"]
                  : formik.values.instance === 38 ||
                      formik.values.instance === 39 ||
                      formik.values.instance === 5
                    ? ["ict", "hbo"]
                    : formik.values.instance === 4 ||
                        formik.values.instance === 6 ||
                        formik.values.instance === 46
                      ? ["ict"]
                      : formik.values.instance === 1 ||
                          formik.values.instance === 32 ||
                          formik.values.instance === 33 ||
                          formik.values.instance === 51
                        ? ["hbo"]
                        : formik.values.instance === 27 ||
                            formik.values.instance === 28 ||
                            formik.values.instance === 29 ||
                            formik.values.instance === 31
                          ? ["doc"]
                          : formik.values.instance === 16 ||
                              formik.values.instance === 17 ||
                              formik.values.instance === 19 ||
                              formik.values.instance === 21 ||
                              formik.values.instance === 26 ||
                              formik.values.instance === 7 ||
                              formik.values.instance === 8 ||
                              formik.values.instance === 9
                            ? ["dhra"]
                            : null,
        )
        .then((resp) => {
          setDepartment(resp.data);
        })
        .catch(() => {});
    }, 500);
  }, [formik.values.instance]);

  useEffect(() => {
    setTimeout(() => {
      hrmsCRUD
        .loadDepartmentAll(
          formik.values.department ? formik.values.department : null,
        )
        .then((resp) => {
          setSubDepartment(resp.data);
        })
        .catch(() => {});
    }, 500);
  }, [formik.values.department]);

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)} size="md">
        <Modal.Header>
          <Modal.Title>New Incidence</Modal.Title>
        </Modal.Header>
        <Divider />
        <form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <div className="container">
              <div className="row">
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="text-body mb-2">
                      Subject
                      <span className="text-danger">&nbsp;*</span>
                    </label>
                    <Input
                      className="form-control"
                      placeholder="Incidence Subject"
                      {...formik.getFieldProps("subject")}
                      status={
                        formik.touched.subject &&
                        formik.errors.subject &&
                        "error"
                      }
                    />
                    {formik.touched.subject && formik.errors.subject && (
                      <div
                        className="fw-light mt-1"
                        style={{ fontSize: "12px" }}
                      >
                        <span role="alert" className="text-danger">
                          {formik.errors.subject}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="text-body mb-2">
                      Incidence <span className="text-danger fw-bold">*</span>
                    </label>
                    <Select
                      size="large"
                      className="w-100"
                      showSearch
                      placeholder="Select incidence"
                      optionFilterProp="children"
                      onChange={(e) => formik.setFieldValue("instance", e)}
                      onSearch={(e) => setIncidenceSearch(e)}
                      filterOption={filterOption}
                      options={incidence?.map((dt) => ({
                        value: dt.id,
                        label: char.toUpperCaseFirst(dt.dictionary_item_name),
                      }))}
                      status={
                        formik.touched.instance &&
                        formik.errors.instance &&
                        "error"
                      }
                    />
                    {formik.touched.instance && formik.errors.instance && (
                      <div
                        className="fw-light mt-1"
                        style={{ fontSize: "12px" }}
                      >
                        <span role="alert" className="text-danger">
                          {formik.errors.instance}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="text-body mb-2">
                      Priority <span className="text-danger fw-bold">*</span>
                    </label>
                    <Select
                      size="large"
                      className="w-100"
                      showSearch
                      placeholder="Select incidence priority"
                      optionFilterProp="children"
                      onChange={(e) => formik.setFieldValue("priority", e)}
                      options={[
                        { value: "low", label: "Low" },
                        { value: "normal", label: "Normal" },
                        { value: "high", label: "High" },
                        { value: "critical", label: "Critical" },
                      ]}
                      status={
                        formik.touched.priority &&
                        formik.errors.priority &&
                        "error"
                      }
                    />
                    {formik.touched.priority && formik.errors.priority && (
                      <div
                        className="fw-light mt-1"
                        style={{ fontSize: "12px" }}
                      >
                        <span role="alert" className="text-danger">
                          {formik.errors.priority}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="text-body mb-2">
                      Root Causes
                      <span className="text-danger">&nbsp;*</span>
                    </label>
                    <Input
                      className="form-control"
                      placeholder="Incidence causes"
                      {...formik.getFieldProps("root")}
                      status={
                        formik.touched.root && formik.errors.root && "error"
                      }
                    />
                    {formik.touched.root && formik.errors.root && (
                      <div
                        className="fw-light mt-1"
                        style={{ fontSize: "12px" }}
                      >
                        <span role="alert" className="text-danger">
                          {formik.errors.root}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="text-body mb-2">
                      Start Date & Time
                      <span className="text-danger">&nbsp;*</span>
                    </label>
                    <DatePicker
                      onChange={(e) => {
                        formik.setFieldValue(
                          "start_time",
                          moment(e).format("YYYY-MM-DD HH:mm:ss.SSSSSSZ"),
                        );
                      }}
                      format="dd MMM yyyy hh:mm:ss"
                      status={
                        formik.touched.start_time &&
                        formik.errors.start_time &&
                        "error"
                      }
                      disabledDate={(date) =>
                        date.getTime() > new Date().getTime()
                      }
                    />
                    {formik.touched.start_time && formik.errors.start_time && (
                      <div
                        className="fw-light mt-1"
                        style={{ fontSize: "12px" }}
                      >
                        <span role="alert" className="text-danger">
                          {formik.errors.start_time}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label className="text-body mb-2">End Date & Time</label>

                    <DatePicker
                      onChange={(e) => {
                        formik.setFieldValue(
                          "end_time",
                          moment(e).format("YYYY-MM-DD HH:mm:ss.SSSSSSZ"),
                        );
                      }}
                      format="dd MMM yyyy hh:mm:ss"
                      status={
                        formik.touched.end_time &&
                        formik.errors.end_time &&
                        "error"
                      }
                      disabledDate={(date) => {
                        const now = new Date();
                        const start = formik.values.start_time
                          ? new Date(formik.values.start_time)
                          : null;

                        // Disable if date is in the future OR before start_time
                        return (
                          date.getTime() > now.getTime() ||
                          (start && date.getTime() < start.getTime())
                        );
                      }}
                    />
                    {formik.touched.end_time && formik.errors.end_time && (
                      <div
                        className="fw-light mt-1"
                        style={{ fontSize: "12px" }}
                      >
                        <span role="alert" className="text-danger">
                          {formik.errors.end_time}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {formik.values.instance && (
                <div className="row mt-3">
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label className="text-body mb-2">
                        Responsible Department
                        <span className="text-danger">&nbsp;*</span>
                      </label>
                      <Select
                        size="large"
                        className="w-100"
                        showSearch
                        placeholder="Select department"
                        optionFilterProp="children"
                        onChange={(e, i) => {
                          formik.setFieldValue("department", e);
                          setDataDept(i.label);
                        }}
                        filterOption={filterOption}
                        options={department?.map((dt) => ({
                          value: dt.id,
                          label: char.toUpperCaseFirst(dt.department_name),
                        }))}
                        status={
                          formik.touched.department &&
                          formik.errors.department &&
                          "error"
                        }
                      />
                      {formik.touched.department &&
                        formik.errors.department && (
                          <div
                            className="fw-light mt-1"
                            style={{ fontSize: "12px" }}
                          >
                            <span role="alert" className="text-danger">
                              {formik.errors.department}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label className="text-body mb-2">
                        Responsible Sub Department
                      </label>
                      <Select
                        size="large"
                        className="w-100"
                        showSearch
                        placeholder="Select sub department"
                        optionFilterProp="children"
                        onChange={(e, i) => {
                          formik.setFieldValue("subDepartment", e);
                          setDataDept(i.label);
                        }}
                        filterOption={filterOption}
                        options={subDepartment?.map((dt) => ({
                          value: dt.id,
                          label: char.toUpperCaseFirst(dt.department_name),
                        }))}
                        status={
                          formik.touched.subDepartment &&
                          formik.errors.subDepartment &&
                          "error"
                        }
                      />
                      {formik.touched.subDepartment &&
                        formik.errors.subDepartment && (
                          <div
                            className="fw-light mt-1"
                            style={{ fontSize: "12px" }}
                          >
                            <span role="alert" className="text-danger">
                              {formik.errors.subDepartment}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}
              <div className="row mt-3">
                <div className="col-md-6 col-sm-12 text-center">
                  <div className="form-group">
                    <label className="text-body mb-2 ">Loss Type</label>
                    <br />
                    <Switch
                      size="large"
                      checkedChildren="Financial Loss"
                      unCheckedChildren="None Financial Loss"
                      checked={formik.values.is_financial_loss}
                      onChange={() => {
                        formik.setFieldValue(
                          "is_financial_loss",
                          !formik.values.is_financial_loss,
                        );
                      }}
                    />
                  </div>
                </div>
                {formik.values.is_financial_loss ? (
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label className="text-body mb-2">
                        Financial Loss Ocured
                      </label>
                      <Input
                        className="form-control"
                        placeholder="Incidence Financial Loss"
                        {...formik.getFieldProps("financial_loss")}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label className="text-body mb-2">
                        Non Financial Loss Ocured
                      </label>
                      <Input
                        className="form-control"
                        placeholder="Incidence Non Financial Loss"
                        {...formik.getFieldProps("non_financial_loss")}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="row mt-3">
                <div className="col-12">
                  <div className="form-group">
                    <label>Descriptions</label>
                    <TextArea
                      className="form-control"
                      rows={5}
                      {...formik.getFieldProps("description")}
                      status={
                        formik.touched.description &&
                        formik.errors.description &&
                        "error"
                      }
                    />
                    {formik.touched.description &&
                      formik.errors.description && (
                        <div
                          className="fw-light mt-1"
                          style={{ fontSize: "12px" }}
                        >
                          <span role="alert" className="text-danger">
                            {formik.errors.description}
                          </span>
                        </div>
                      )}
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
                    onClick={() => setOpen(false)}
                    type="button"
                    className="btn btn-soft-danger btn-label waves-effect waves-light rounded-pill me-3"
                  >
                    <i class="ri-forbid-line label-icon align-middle rounded-pill fs-16 me-2"></i>{" "}
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-soft-success btn-label waves-effect waves-light rounded-pill"
                    disabled={formik.isSubmitting}
                  >
                    {!loading && (
                      <span className="indicator-label">
                        <i class="ri-check-double-line label-icon align-middle rounded-pill fs-16 me-2"></i>{" "}
                        Save
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
