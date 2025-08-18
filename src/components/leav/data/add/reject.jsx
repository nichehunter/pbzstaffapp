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

const rejectSchema = Yup.object().shape({
  comment: Yup.string().required("This field is required"),
});

const initialValues = {
  comment: "",
};

export const LeaveReject = (props) => {
  const { open, setOpen, index, setIndex, dataId, dataInfo } = props;

  const user = selector.User();
  const staff = selector.Staff();
  const toaster = useToaster();

  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState(null);

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
    validationSchema: rejectSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const { comment } = values;
      const recorded_by = user.username;
      const rejected_by = staff.id;

      const data = {
        leave: dataId,
        reason: comment,
        rejected_by,
        recorded_by,
      };

      setLoading(true);
      setTimeout(() => {
        hrmsCRUD
          .addLeaveReject(data)
          .then((resp) => {
            if (comment !== "" || comment !== undefined || comment !== null) {
              const dataComment = {
                leave: dataId,
                reject: resp.data.id,
                comment,
                commented_by: staff.id,
                recorded_by,
              };
              hrmsCRUD.addLeaveComment(dataComment).then(() => {});
              hrmsCRUD.addLeaveStatus(dataId, { status: 49 }).then(() => {});
            }

            const dataHREmail = {
              email: "humanresources@pbzbank.co.tz",
              subject: "Leave Approval",
              message: `
             <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                <p>Dear HR Team,</p>
                <p>
                  The leave request submitted by <strong>${char?.toUpperCase(
                    dataInfo?.assigned_by?.full_name
                  )}</strong> has been <strong>rejected</strong> by their supervisor, <strong>${char?.toUpperCase(
                dataInfo?.assigned_to?.full_name
              )}</strong>.
                </p>
                <p>Reason for Rejection:</p>
                <blockquote style="margin: 10px 0; padding: 10px; border-left: 4px solid #f44336; background-color: #fdd; color: #900;">
                  ${char.toTitleCase(comment)}
                </blockquote>
                <p>Please log in to the system to update the status and notify the employee.</p>
                <p>Thank you,</p>
              </div>
            `,
            };

            const dataStaffEmail = {
              email: owner?.email,
              subject: "Leave Rejection",
              message: `
              <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
              <p>Dear ${char?.toUpperCase(
                dataInfo?.assigned_by?.full_name
              )},</p>
              <p>
                Unfortunately, your leave request has been <strong>rejected</strong> by your supervisor, <strong>${char?.toUpperCase(
                  dataInfo?.assigned_to?.full_name
                )}</strong>.
              </p>
              <p>Reason for Rejection:</p>
              <blockquote style="margin: 10px 0; padding: 10px; border-left: 4px solid #f44336; background-color: #fdd; color: #900;">
                ${char.toTitleCase(comment)}
              </blockquote>
              <p>
                If you have any questions or need further clarification, please contact your supervisor directly.
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
                Thank you....! another leave has been rejected.
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
          <Modal.Title>Leave Reject</Modal.Title>
        </Modal.Header>
        <Divider />
        <form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="form-group">
                    <label className="text-body mb-2">Reason to reject</label>
                    <textarea
                      rows={5}
                      className="form-control"
                      {...formik.getFieldProps("comment")}
                    />
                    {formik.touched.comment && formik.errors.comment && (
                      <div
                        className="fw-light mt-1"
                        style={{ fontSize: "12px" }}
                      >
                        <span role="alert" className="text-danger">
                          {formik.errors.comment}
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
