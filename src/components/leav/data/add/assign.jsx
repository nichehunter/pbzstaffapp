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
import { char, matters, number } from "../../../../utils";
import moment from "moment";
import { authCRUD } from "../../../../actions/auth";

const assignSchema = Yup.object().shape({
  assigned_to: Yup.string().required("This field is required"),
});

const initialValues = {
  comment: "",
  assigned_to: "",
};

export const LeaveAssignment = (props) => {
  const { open, setOpen, index, setIndex, dataId, dataInfo } = props;

  const user = selector.User();
  const staff = selector.Staff();
  const toaster = useToaster();

  const [loading, setLoading] = useState(false);
  const [supervisor, setSupervisor] = useState([]);
  const [owner, setOwner] = useState(null);
  const [newSupervisor, setNewSupervisor] = useState(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    setTimeout(() => {
      hrmsCRUD
        .loadSupervisor(20, 0, "", true, value, "id")
        .then((resp) => {
          setSupervisor(resp.data.results);
        })
        .catch(() => {});
    }, 500);
  }, [value]);

  useEffect(() => {
    if (dataInfo) {
      setTimeout(() => {
        hrmsCRUD
          .loadStaffData(dataInfo?.assigned_by?.staff_opf)
          .then((resp) => {
            setOwner(resp.data);
          })
          .catch(() => {});
      }, 500);
    }
  }, [dataInfo]);
  

  const formik = useFormik({
    initialValues,
    validationSchema: assignSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const { comment, assigned_to } = values;
      const recorded_by = user.username;

      const data = {
        leave: dataId,
        assigned_to,
        is_active: true,
        recorded_by,
      };
      

      setLoading(true);
      setTimeout(() => {
        hrmsCRUD
          .addLeaveFoward(data)
          .then((resp) => {
            if (comment !== "" || comment !== undefined || comment !== null) {
              const dataComment = {
                leave: dataId,
                assignment: resp.data.id,
                comment,
                commented_by: staff.id,
                recorded_by,
              };
              hrmsCRUD.addLeaveComment(dataComment).then(() => {});
            }

            const dataHREmail = {
              email: "humanresources@pbzbank.co.tz",
              subject: "Leave Assignment",
              message: `
              <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                <p>Dear HR Team,</p>
                <p>
                  The leave request submitted by <strong>${char?.toUpperCase(
                    dataInfo?.assigned_by?.full_name
                  )}</strong> has been <strong>reassigned</strong> by their supervisor, 
                  <strong>${char?.toUpperCase(
                    dataInfo?.assigned_to?.full_name
                  )}</strong>, to <strong>${char.toUpperCase(newSupervisor)}</strong> for review.
                </p>
                <p>
                  Please log in to the system to monitor the progress of this request.
                </p>
                <p>Thank you,</p>
                <p><strong>HR System Team</strong></p>
              </div>
            `,
            };

            const dataStaffEmail = {
              email: owner?.email,
              subject: "Leave Assignment",
              message: `
              <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                <p>Dear ${char?.toUpperCase(
                  dataInfo?.assigned_by?.full_name
                )},</p>
                <p>
                  Your leave request has been <strong>reassigned</strong> by your supervisor, <strong>${char?.toUpperCase(
                    dataInfo?.assigned_to?.full_name
                  )}</strong>, 
                  to <strong>${char.toUpperCase(
                    newSupervisor
                  )}</strong> for review.
                </p>
                <p>
                  The new supervisor will review your request and provide a response shortly. You can track the status of your request by logging into the system.
                </p>
                <p>Thank you,</p>
              </div>
            `,
            };

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
                Thank you....! another leave has been assigned.
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

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)} size="md">
        <Modal.Header>
          <Modal.Title>Leave Approval</Modal.Title>
        </Modal.Header>
        <Divider />
        <form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <div className="container">
              <div className="row mb-2">
                <div className="col-12">
                  <div className="form-group">
                    <label className="text-body mb-2">
                      Assigned Staff <span className="text-danger ms-2">*</span>
                    </label>
                    <SelectPicker
                      data={supervisor?.map((dt) => ({
                        value: dt.staff.id,
                        name: dt.staff.full_name,
                        label:
                          dt.staff.staff_opf +
                          ". " +
                          char.toTitleCase(dt.staff.full_name),
                      }))}
                      placeholder="Select staff"
                      onChange={(e) => {
                        const selectedSupervisor = supervisor.find(
                          (dt) => dt.staff.id === e
                        );
                        const selectedName = selectedSupervisor
                          ? selectedSupervisor.staff.full_name
                          : "";
                        formik.setFieldValue("assigned_to", e);
                        setNewSupervisor(selectedName); // Set only the name
                      }}
                      onSearch={(e) => {
                        setValue(e);
                      }}
                      block={true}
                    />
                    {formik.touched.assigned_to &&
                      formik.errors.assigned_to && (
                        <div
                          className="fw-light mt-1"
                          style={{ fontSize: "12px" }}
                        >
                          <span role="alert" className="text-danger">
                            {formik.errors.assigned_to}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <label className="text-body mb-2">Comments</label>
                    <textarea
                      rows={5}
                      className="form-control"
                      {...formik.getFieldProps("comment")}
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
                    onClick={() => setOpen(false)}
                    className="btn btn-danger me-3"
                    type="button"
                  >
                    <span className="bi bi-slash-circle"></span> Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={formik.isSubmitting || loading}
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
