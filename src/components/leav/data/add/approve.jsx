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
import { use } from "i18next";

const initialValues = {
  comment: "",
};

export const LeaveApprove = (props) => {
  const { open, setOpen, index, setIndex, dataId, dataInfo } = props;

  const user = selector.User();
  const staff = selector.Staff();
  const toaster = useToaster();

  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    if(dataInfo){
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
    validationSchema: null,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const { comment } = values;
      const recorded_by = user.username;
      const approved_by = staff.id;

      const data = {
        leave: dataId,
        approved_by,
        recorded_by,
      };

      

      setLoading(true);
      setTimeout(() => {
        hrmsCRUD
          .addLeaveApproval(data)
          .then((resp) => {
            if (comment !== "" || comment !== undefined || comment !== null) {
              const dataComment = {
                leave: dataId,
                approve: resp.data.id,
                comment,
                commented_by: staff.id,
                recorded_by,
              };
              hrmsCRUD.addLeaveComment(dataComment).then(() => {});
              hrmsCRUD.addLeaveStatus(dataId, {status: 47}).then(() => {});
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
                  )}</strong> 
                  has been <strong>approved</strong> by, <strong>${char?.toUpperCase(
                    dataInfo?.assigned_to?.full_name
                  )}</strong>.
                </p>
                <p>Leave Details:</p>
                <ul>
                  <li><strong>Start Date:</strong> ${moment(
                    dataInfo?.leave?.start_date
                  ).format("DD. MMM YYYY")}</li>
                  <li><strong>End Date:</strong> ${moment(
                    dataInfo?.leave?.end_date
                  ).format("DD. MMM YYYY")}</li>
                  <li><strong>Reason:</strong> ${char.toTitleCase(comment)}</li>
                </ul>
                <p>Please log in to the hr system for further processing</p>
                <p>Thank you,</p>
              </div>
            `,
            };

            const dataStaffEmail = {
              email: owner?.email,
              subject: "Leave Approval",
              message: `
              <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                <p>Dear ${char?.toUpperCase(dataInfo?.assigned_by?.full_name)},</p>
                <p>
                  Your leave request has been <strong>approved</strong> by your supervisor, <strong>${char?.toUpperCase(
                    dataInfo?.assigned_to?.full_name
                  )}</strong>.
                </p>
                <p>Leave Details:</p>
                <ul>
                  <ul>
                  <li><strong>Start Date:</strong> ${moment(
                    dataInfo?.leave?.start_date
                  ).format("DD. MMM YYYY")}</li>
                  <li><strong>End Date:</strong> ${moment(
                    dataInfo?.leave?.end_date
                  ).format("DD. MMM YYYY")}</li>
                  <li><strong>Reason:</strong> ${char.toTitleCase(comment)}</li>
                </ul>
                </ul>
                <p>
                  If you have any questions, feel free to contact your supervisor or the HR department.
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
                Thank you....! another leave has been approved.
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
