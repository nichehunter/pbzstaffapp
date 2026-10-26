import { useEffect, useState } from "react";
import { Card, Checkbox, Input } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { authActions, authCRUD } from "../../../actions/auth";
import { useAuth } from "../../../context/AuthContext";
import { char } from "../../../utils";
import "./styles/login.css";

const loginSchema = Yup.object().shape({
  username: Yup.string().required("This field is required"),
  password: Yup.string().required("This field is required"),
});

const initialValues = {
  username: "",
  password: "",
  system: "pbz-sys-0004",
};

export const LoginContent = () => {
  const [loading, setLoading] = useState(false);
  const { getOtp } = useAuth();
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer); // cleanup
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const { username, password, system } = values;
      const data = { username, password, system };

      setTimeout(() => {
        authCRUD
          .loadToken(data)
          .then((resp) => {
            dispatch(authActions.getUser(resp.data.user));

            if (resp.data.user.is_first_login) {
              dispatch(authActions.setAuth(null));
              dispatch(authActions.getToken(resp.data.token));
              navigate("/firstlogin");
              setLoading(false);
            } else {
              const { roles, ...systemWithoutRoles } = resp.data.system;
              dispatch(authActions.setAuth(false));
              dispatch(authActions.getToken(resp.data.token));
              dispatch(authActions.getSystem(systemWithoutRoles));
              dispatch(authActions.getRole(roles.map((role) => role.name)));
              getOtp({
                email: resp.data.user.email,
                system: char.toUpperCase(systemWithoutRoles?.name),
                name: char.toUpperCase(
                  resp?.data?.user?.first_name +
                    " " +
                    resp?.data?.user?.last_name,
                ),
                time: 2.5,
              });
              navigate("/otp");
              setLoading(false);
            }
          })
          .catch((error) => {
            if (error) {
              setStatus(
                error.response
                  ? error.response.data.error
                  : "Invalid credentials",
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
      <div className="pbz-entry-page">
        <div className="pbz-entry-layout">
          {/* ================================
        LEFT BRAND PANEL
    ================================= */}

          <section className="pbz-entry-brand">
            <div className="pbz-entry-pattern" />

            <div className="pbz-entry-brand-content">
              <div className="pbz-entry-logo-area">
                <img
                  src="assets/images/logo/pbz1.png"
                  alt="People's Bank of Zanzibar"
                  className="pbz-entry-logo"
                />

                <div className="pbz-entry-badge">EMPLOYEE ACCESS</div>
              </div>

              <div className="pbz-entry-message">
                <span className="pbz-entry-overline">
                  THE PEOPLE'S BANK OF ZANZIBAR
                </span>

                <h1>
                  Welcome to your
                  <br />
                  <span>staff portal.</span>
                </h1>

                <p>
                  A secure gateway to the services and information you need
                  throughout your journey with PBZ.
                </p>

                <div className="pbz-entry-line" />

                <div className="pbz-entry-quote">
                  <span className="bi bi-quote" />

                  <p>
                    Together, we serve our people, our customers and our
                    community.
                  </p>
                </div>
              </div>

              <div className="pbz-entry-brand-footer">
                <div>
                  <strong>The People's Bank, The People's Choice</strong>

                  <span>
                    Serving with integrity, excellence and commitment.
                  </span>
                </div>

                <div className="pbz-entry-time">
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

          {/* ================================
        RIGHT LOGIN AREA
    ================================= */}

          <section className="pbz-entry-login">
            <div className="pbz-entry-card">
              <div className="pbz-entry-card-top">
                <span className="pbz-entry-card-label">STAFF PORTAL</span>

                <div className="pbz-entry-secure">
                  <span className="bi bi-shield-lock" />
                  Secure
                </div>
              </div>

              <div className="pbz-entry-card-heading">
                <h2>Sign in</h2>

                <p>Enter your credentials to continue to PBZ Staff Portal.</p>
              </div>

              {formik.status && (
                <div className="pbz-entry-alert">
                  <span className="bi bi-exclamation-circle-fill" />

                  <div>
                    <strong>Sign in unsuccessful</strong>

                    <span>{formik.status}</span>
                  </div>
                </div>
              )}

              <form onSubmit={formik.handleSubmit} className="pbz-entry-form">
                {/* OPF NUMBER */}
                <div className="pbz-field">
                  <label>
                    OPF Number
                    <span>*</span>
                  </label>

                  <Input
                    size="large"
                    prefix={<UserOutlined className="pbz-input-icon" />}
                    placeholder="Enter your OPF number"
                    {...formik.getFieldProps("username")}
                    status={
                      formik.touched.username && formik.errors.username
                        ? "error"
                        : ""
                    }
                  />

                  {formik.touched.username && formik.errors.username && (
                    <div className="pbz-field-error">
                      <i className="bi bi-exclamation-circle" />
                      {formik.errors.username}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="pbz-field">
                  <label>
                    Password
                    <span>*</span>
                  </label>

                  <Input.Password
                    size="large"
                    prefix={<LockOutlined className="pbz-input-icon" />}
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    placeholder="Enter your password"
                    {...formik.getFieldProps("password")}
                    status={
                      formik.touched.password && formik.errors.password
                        ? "error"
                        : ""
                    }
                  />

                  {formik.touched.password && formik.errors.password && (
                    <div className="pbz-field-error">
                      <i className="bi bi-exclamation-circle" />
                      {formik.errors.password}
                    </div>
                  )}
                </div>

                {/* OPTIONS */}
                <div className="pbz-entry-options">
                  <Checkbox>Remember me</Checkbox>

                  <Link to="/reset" className="pbz-entry-forgot">
                    Forgot Password?
                  </Link>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="pbz-entry-button"
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  {formik.isSubmitting || loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Staff Portal</span>
                      <span className="bi bi-arrow-right" />
                    </>
                  )}
                </button>
              </form>

              {/* SECURITY */}
              <div className="pbz-entry-security">
                <div className="pbz-entry-security-icon">
                  <span className="bi bi-shield-check" />
                </div>

                <div>
                  <strong>Protected employee access</strong>

                  <span>
                    Never share your OPF number or password with anyone.
                  </span>
                </div>
              </div>

              {/* FOOTER */}
              <div className="pbz-entry-card-footer">
                <div className="pbz-entry-footer-links">
                  <span>PBZ Staff Portal</span>
                  <i>•</i>
                  <span>Employee Access</span>
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
