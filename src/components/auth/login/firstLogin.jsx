import { useEffect, useState } from "react";
import { Card, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authCRUD } from "../../../actions/auth";
import { Headers, selector } from "../../../api";
import { Message, useToaster } from "rsuite";
import { char } from "../../../utils";
import "./styles/password.css";
import moment from "moment";

const authSchema = Yup.object().shape({
  old_password: Yup.string().required("This field is required"),
  new_password: Yup.string()
    .min(8, "Must Contain atleast 8 Characters")
    .required("This field is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("new_password"), null], "Passwords must match")
    .required("This field is required"),
});

const initialValues = {
  old_password: "",
  new_password: "",
  confirmPassword: "",
};

export const FirstLoginContent = () => {
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const user = selector.User();
  const token = selector.AccessToken();
  const toaster = useToaster();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer); // cleanup
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("persist:root");
    navigate("/", { replace: true });
    document.location.reload();
  };

  console.log(token);

  const formik = useFormik({
    initialValues,
    validationSchema: authSchema,
    onSubmit: (values, { setStatus, setSubmitting, resetForm }) => {
      setLoading(true);
      setTimeout(() => {
        const { old_password, new_password } = values;
        const data = {
          old_password,
          new_password,
        };

        const emailData = {
          email: user.email,
          subject: "Thank You for Changing Your Password!",
          message: `
            <html>
              <body>
                <p>Dear ${char.toUpperCase(
                  user?.first_name + " " + user?.last_name,
                )},</p>
                <p>We appreciate you taking the necessary steps to change your password. For your security, it is always a good practice to keep your password updated.</p>
                <p>If you didn't initiate this change, please contact the IT support team immediately to ensure the security of your account.</p>
                <p>Your password update was successfully completed on ${moment().format(
                  "MMM, DD YYYY",
                )}.</p>
              </body>
            </html>
          `,
        };

        authCRUD
          .updatePassword(user.id, data, Headers(token))
          .then(() => {
            authCRUD.sendEmail(emailData).then(() => {});
            authCRUD.PostAuthorise(user.id).then(() => {});
            toaster.push(
              <Message type="success" showIcon header={"Success"} closable>
                <p className="h6">
                  <p className="fw-bold fs-14">Thank you...!</p>
                  <p className="text-dark fs-12">
                    Password has been updated successfully.
                  </p>
                </p>
              </Message>,
              { placement: "topEnd", duration: 7000 },
            );
            localStorage.removeItem("persist:root");
            navigate("/", { replace: true });
            resetForm();
            setLoading(false);
            setSubmitting(false);
          })
          .catch((error) => {
            if (error) {
              resetForm();
              setLoading(false);
              setSubmitting(false);
              setStatus("Sorry....! You are not active user");
            }
          });
      }, 1000);
    },
  });

  return (
    <>
      <div className="pbz-password-page">
        <div className="pbz-password-layout">
          {/* LEFT BRAND PANEL */}
          <section className="pbz-password-brand">
            <div className="pbz-password-pattern" />

            <div className="pbz-password-brand-content">
              <div className="pbz-password-brand-top">
                <img
                  src="assets/images/logo/pbz1.png"
                  alt="People's Bank of Zanzibar"
                  className="pbz-password-brand-logo"
                />

                <div className="pbz-password-badge">STAFF PORTAL</div>
              </div>

              <div className="pbz-password-brand-message">
                <span className="pbz-password-overline">ACCOUNT SECURITY</span>

                <h1>
                  Create your
                  <br />
                  <span>secure password.</span>
                </h1>

                <p>
                  Your password protects access to your employee information and
                  PBZ staff services.
                </p>

                <div className="pbz-password-security-list">
                  <div className="pbz-password-security-item">
                    <div className="pbz-password-security-icon">
                      <span className="bi bi-shield-lock" />
                    </div>

                    <div>
                      <strong>Protect your account</strong>
                      <span>Use a password that only you know.</span>
                    </div>
                  </div>

                  <div className="pbz-password-security-item">
                    <div className="pbz-password-security-icon">
                      <span className="bi bi-key" />
                    </div>

                    <div>
                      <strong>Use a strong password</strong>
                      <span>Choose a password that is difficult to guess.</span>
                    </div>
                  </div>

                  <div className="pbz-password-security-item">
                    <div className="pbz-password-security-icon">
                      <span className="bi bi-check2-circle" />
                    </div>

                    <div>
                      <strong>Keep it private</strong>
                      <span>Never share your password with anyone.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pbz-password-brand-footer">
                <div>
                  <strong>The People's Bank of Zanzibar</strong>
                  <span>The People's Bank, The People's Choice</span>
                </div>

                <div className="pbz-password-clock">
                  <span className="bi bi-clock" />

                  <div>
                    <strong>{currentTime.toLocaleTimeString()}</strong>

                    <small>
                      {currentTime.toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT FORM PANEL */}
          <section className="pbz-password-side">
            <div className="pbz-password-card">
              <div className="pbz-password-card-top">
                <span className="pbz-password-card-label">
                  PBZ AUTH MANAGEMENT
                </span>

                <div className="pbz-password-secure">
                  <span className="bi bi-shield-check" />
                  Secure
                </div>
              </div>

              <div className="pbz-password-main-icon">
                <div className="pbz-password-icon-circle">
                  <span className="bi bi-key" />
                </div>
              </div>

              <div className="pbz-password-heading">
                <h2>Change your password</h2>

                <p>
                  For your security, please change your default password before
                  accessing the staff portal.
                </p>
              </div>

              {/* STATUS MESSAGE */}
              {formik.status ? (
                <div className="pbz-password-alert pbz-password-alert-danger">
                  <span className="bi bi-exclamation-circle-fill" />

                  <div>
                    <strong>Password change unsuccessful</strong>
                    <span>{formik.status}</span>
                  </div>
                </div>
              ) : (
                <div className="pbz-password-alert pbz-password-alert-info">
                  <span className="bi bi-info-circle-fill" />

                  <div>
                    <strong>Default password</strong>
                    <span>
                      Please change your default password to continue.
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={formik.handleSubmit}>
                {/* CURRENT PASSWORD */}
                <div className="pbz-password-field">
                  <label htmlFor="old_password">Current Password</label>

                  <Input.Password
                    id="old_password"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    placeholder="Enter current password"
                    {...formik.getFieldProps("old_password")}
                    status={
                      formik.touched.old_password && formik.errors.old_password
                        ? "error"
                        : ""
                    }
                  />

                  {formik.touched.old_password &&
                    formik.errors.old_password && (
                      <div className="pbz-password-error">
                        <span className="bi bi-exclamation-circle" />
                        {formik.errors.old_password}
                      </div>
                    )}
                </div>

                {/* NEW PASSWORD */}
                <div className="pbz-password-field">
                  <label htmlFor="new_password">New Password</label>

                  <Input.Password
                    id="new_password"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    placeholder="Enter new password"
                    {...formik.getFieldProps("new_password")}
                    status={
                      formik.touched.new_password && formik.errors.new_password
                        ? "error"
                        : ""
                    }
                  />

                  {formik.touched.new_password &&
                    formik.errors.new_password && (
                      <div className="pbz-password-error">
                        <span className="bi bi-exclamation-circle" />
                        {formik.errors.new_password}
                      </div>
                    )}
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="pbz-password-field">
                  <label htmlFor="confirmPassword">Confirm New Password</label>

                  <Input.Password
                    id="confirmPassword"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    placeholder="Re-enter new password"
                    {...formik.getFieldProps("confirmPassword")}
                    status={
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                        ? "error"
                        : ""
                    }
                  />

                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <div className="pbz-password-error">
                        <span className="bi bi-exclamation-circle" />
                        {formik.errors.confirmPassword}
                      </div>
                    )}
                </div>

                {/* PASSWORD SECURITY NOTE */}
                <div className="pbz-password-security-note">
                  <span className="bi bi-shield-check" />

                  <div>
                    <strong>Password security</strong>

                    <span>
                      Choose a password you do not use for other accounts and
                      keep it confidential.
                    </span>
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="pbz-password-submit"
                  disabled={formik.isSubmitting}
                >
                  {!loading ? (
                    <>
                      <span className="bi bi-key" />
                      <span>Change Password</span>
                      <span className="bi bi-arrow-right" />
                    </>
                  ) : (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      />

                      <span>Please wait...</span>
                    </>
                  )}
                </button>

                {/* LOGIN AGAIN */}
                <div className="pbz-password-login-again">
                  <span>Not your account?</span>

                  <Link to="#" onClick={handleLogout}>
                    Sign in again
                    <span className="bi bi-arrow-right" />
                  </Link>
                </div>
              </form>

              {/* FOOTER */}
              <div className="pbz-password-card-footer">
                <div className="pbz-password-footer-links">
                  <span>PBZ Staff Portal</span>
                  <i>•</i>
                  <span>Secure Access</span>
                </div>

                <span>
                  © {new Date().getFullYear()} People's Bank of Zanzibar
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
