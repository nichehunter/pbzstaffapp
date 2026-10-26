import { useEffect, useState } from "react";
import { Card, Input } from "antd";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authCRUD } from "../../../actions/auth";
import { Message, useToaster } from "rsuite";
import { char, code } from "../../../utils";
import "./styles/reset.css";

const loginSchema = Yup.object().shape({
  username: Yup.string().required("This field is required"),
});

const initialValues = {
  username: "",
};

export const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const toaster = useToaster();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer); // cleanup
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values, { setStatus, setSubmitting, resetForm }) => {
      setLoading(true);
      const { username } = values;

      setTimeout(() => {
        authCRUD
          .loadUser(username)
          .then((resp) => {
            const user = resp.data;

            const password = code.generateRandomPassword(
              user.first_name.split(" ").length > 1
                ? user.first_name.split(" ").slice(0, -1).join(" ")
                : user.first_name,
            );

            const data = { username, new_password: password };

            const emailData = {
              email: user.email,
              subject: "Password Reset",
              message: `
              <html>
                <body>
                  <p>Dear ${char.toUpperCase(
                    user?.first_name + " " + user?.last_name,
                  )},</p>
                  <p>Your password has been reset. Here is your default password: <span style="color: #FF0000;">${password}</span></p>
                  <p>Please change your password after logging in.</p>
                </body>
              </html>
            `,
            };

            authCRUD
              .resetPassword(data)
              .then((resp) => {
                authCRUD.sendEmail(emailData).then(() => {});
                toaster.push(
                  <Message type="success" showIcon header={"Success"} closable>
                    <p className="h6">
                      <p className="fw-bold fs-14">Thank you...!</p>
                      <p className="text-dark fs-12">
                        Password has been reset successfully.
                      </p>
                      <p className="text-dark fs-12">
                        Please go to your email and check new password.
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
                  setStatus(
                    error.response
                      ? error.response.data.error
                      : "Invalid credentials",
                  );
                }
              });
          })
          .catch((error) => {
            if (error) {
              setStatus(
                error.response
                  ? error.response.data.error
                  : "You are not active user",
              );
            }
          })
          .finally(() => {
            setLoading(false);
            setSubmitting(false);
          });
      }, 500);
    },
  });

  return (
    <>
      <div className="pbz-reset-page">
        <div className="pbz-reset-layout">
          {/* LEFT BRAND PANEL */}
          <section className="pbz-reset-brand">
            <div className="pbz-reset-pattern" />

            <div className="pbz-reset-brand-content">
              <div className="pbz-reset-brand-top">
                <img
                  src="assets/images/logo/pbz1.png"
                  alt="People's Bank of Zanzibar"
                  className="pbz-reset-brand-logo"
                />

                <div className="pbz-reset-badge">STAFF PORTAL</div>
              </div>

              <div className="pbz-reset-brand-message">
                <span className="pbz-reset-overline">ACCOUNT RECOVERY</span>

                <h1>
                  Reset your
                  <br />
                  <span>account password.</span>
                </h1>

                <p>
                  Forgot your password? Start the recovery process using your
                  PBZ employee identification number.
                </p>

                <div className="pbz-reset-security-list">
                  <div className="pbz-reset-security-item">
                    <div className="pbz-reset-security-icon">
                      <span className="bi bi-person-badge" />
                    </div>

                    <div>
                      <strong>Staff identification</strong>
                      <span>
                        Use your registered OPF number to identify your account.
                      </span>
                    </div>
                  </div>

                  <div className="pbz-reset-security-item">
                    <div className="pbz-reset-security-icon">
                      <span className="bi bi-shield-lock" />
                    </div>

                    <div>
                      <strong>Secure recovery</strong>
                      <span>Your account recovery process is protected.</span>
                    </div>
                  </div>

                  <div className="pbz-reset-security-item">
                    <div className="pbz-reset-security-icon">
                      <span className="bi bi-arrow-repeat" />
                    </div>

                    <div>
                      <strong>Restore access</strong>
                      <span>
                        Continue to recover access to your staff account.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pbz-reset-brand-footer">
                <div>
                  <strong>The People's Bank of Zanzibar</strong>
                  <span>The People's Bank, The People's Choice</span>
                </div>

                <div className="pbz-reset-clock">
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

          {/* RIGHT RESET PANEL */}
          <section className="pbz-reset-side">
            <div className="pbz-reset-card">
              <div className="pbz-reset-card-top">
                <span className="pbz-reset-card-label">
                  PBZ AUTH MANAGEMENT
                </span>

                <div className="pbz-reset-secure">
                  <span className="bi bi-shield-check" />
                  Secure
                </div>
              </div>

              {/* ICON */}
              <div className="pbz-reset-main-icon">
                <div className="pbz-reset-icon-circle">
                  <span className="bi bi-key" />
                </div>
              </div>

              {/* HEADING */}
              <div className="pbz-reset-heading">
                <h2>Reset your password</h2>

                <p>
                  Enter your OPF number to begin the password recovery process.
                </p>
              </div>

              {/* ERROR */}
              {formik.status && (
                <div className="pbz-reset-alert">
                  <span className="bi bi-exclamation-circle-fill" />

                  <div>
                    <strong>Unable to continue</strong>
                    <span>{formik.status}</span>
                  </div>
                </div>
              )}

              <form onSubmit={formik.handleSubmit}>
                {/* OPF NUMBER */}
                <div className="pbz-reset-field">
                  <label htmlFor="username">
                    OPF Number
                    <span>*</span>
                  </label>

                  <div className="pbz-reset-input-wrapper">
                    <span className="bi bi-person-badge" />

                    <Input
                      id="username"
                      size="large"
                      placeholder="Enter your OPF number"
                      {...formik.getFieldProps("username")}
                      status={
                        formik.touched.username && formik.errors.username
                          ? "error"
                          : ""
                      }
                    />
                  </div>

                  {formik.touched.username && formik.errors.username && (
                    <div className="pbz-reset-error">
                      <span className="bi bi-exclamation-circle" />
                      {formik.errors.username}
                    </div>
                  )}
                </div>

                {/* INFORMATION */}
                <div className="pbz-reset-info">
                  <span className="bi bi-info-circle" />

                  <div>
                    <strong>How it works</strong>

                    <span>
                      Enter your OPF number and follow the verification steps to
                      reset your password.
                    </span>
                  </div>
                </div>

                {/* RESET BUTTON */}
                <button
                  type="submit"
                  className="pbz-reset-submit"
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  {!loading ? (
                    <>
                      <span className="bi bi-shield-lock" />
                      <span>Reset Password</span>
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
                <div className="pbz-reset-login-again">
                  <span>Remember your password?</span>

                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("persist:root");
                      navigate("/", { replace: true });
                    }}
                  >
                    Sign in
                    <span className="bi bi-arrow-right" />
                  </button>
                </div>
              </form>

              {/* FOOTER */}
              <div className="pbz-reset-card-footer">
                <div className="pbz-reset-footer-links">
                  <span>PBZ Staff Portal</span>
                  <i>•</i>
                  <span>Secure Recovery</span>
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
