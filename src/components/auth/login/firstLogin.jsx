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
                  user?.first_name + " " + user?.last_name
                )},</p>
                <p>We appreciate you taking the necessary steps to change your password. For your security, it is always a good practice to keep your password updated.</p>
                <p>If you didn't initiate this change, please contact the IT support team immediately to ensure the security of your account.</p>
                <p>Your password update was successfully completed on ${moment().format(
                  "MMM, DD YYYY"
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
              { placement: "bottomEnd", duration: 7000 }
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
      <div className="container-fluid position-relative">
        <div className="row">
          <div className="col-md-4" />
          <div
            className="col-md-8 d-flex flex-column justify-content-center align-items-center p-5 text-dark"
            style={{ backgroundColor: "#F5F5F5", minHeight: "100vh" }}
          >
            <p className="h1 fw-bold text-center mb-4">
              The People's Bank of Zanzibar
            </p>
            <p className="h5 text-center mb-4">
              Let's achieve great results together today.
            </p>
            <p className="h2 text-center fw-bold">
              {currentTime.toLocaleTimeString()}
            </p>
          </div>
          <Card className="login-card ps-4 pe-4">
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-12 text-center">
                    <img
                      width={250}
                      className="mt-0 mb-2"
                      src="assets/images/logo/pbz1.png"
                      alt=""
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <p className="text-center h3">
                      The People's Bank of Zanzibar
                    </p>
                    <p className="text-center h5 mt-3 fw-bold ff-primary">
                      PBZ AUTH MANAGEMENT PORTAL
                    </p>
                    {formik.status ? (
                      <div className="alert alert-danger mt-3">
                        <div className="alert-text fw-light text-center">
                          {formik.status}
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-info mt-3 ms-2 me-2">
                        <div className="alert-text fw-bold text-center h6fs-13">
                          {"Please change your default password"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <hr />
                    <form onSubmit={formik.handleSubmit}>
                      <div className="row ms-2 me-2 mt-3">
                        <div className="col-sm-5">
                          <p className="h6 fs-15 mt-2">Current Password</p>
                        </div>
                        <div className="col-sm-7">
                          <div className="form-group">
                            <Input.Password
                              iconRender={(visible) =>
                                visible ? (
                                  <EyeTwoTone />
                                ) : (
                                  <EyeInvisibleOutlined />
                                )
                              }
                              placeholder="Current Password"
                              {...formik.getFieldProps("old_password")}
                              status={
                                formik.touched.old_password &&
                                formik.errors.old_password &&
                                "error"
                              }
                            />
                            {formik.touched.old_password &&
                              formik.errors.old_password && (
                                <div
                                  className="fw-light mt-1"
                                  style={{ fontSize: "12px" }}
                                >
                                  <span role="alert" className="text-danger">
                                    {formik.errors.old_password}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="row ms-2 me-2 mt-3">
                        <div className="col-sm-5">
                          <p className="h6 fs-15 mt-2">New Password</p>
                        </div>
                        <div className="col-sm-7">
                          <div className="form-group">
                            <Input.Password
                              iconRender={(visible) =>
                                visible ? (
                                  <EyeTwoTone />
                                ) : (
                                  <EyeInvisibleOutlined />
                                )
                              }
                              placeholder="New Password"
                              {...formik.getFieldProps("new_password")}
                              status={
                                formik.touched.new_password &&
                                formik.errors.new_password &&
                                "error"
                              }
                            />
                            {formik.touched.new_password &&
                              formik.errors.new_password && (
                                <div
                                  className="fw-light mt-1"
                                  style={{ fontSize: "12px" }}
                                >
                                  <span role="alert" className="text-danger">
                                    {formik.errors.new_password}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="row ms-2 me-2 mt-3">
                        <div className="col-sm-5">
                          <p className="h6 fs-15 mt-2">Confirm Password</p>
                        </div>
                        <div className="col-sm-7">
                          <div className="form-group">
                            <Input.Password
                              iconRender={(visible) =>
                                visible ? (
                                  <EyeTwoTone />
                                ) : (
                                  <EyeInvisibleOutlined />
                                )
                              }
                              placeholder="Confirm Password"
                              {...formik.getFieldProps("confirmPassword")}
                              status={
                                formik.touched.confirmPassword &&
                                formik.errors.confirmPassword &&
                                "error"
                              }
                            />
                            {formik.touched.confirmPassword &&
                              formik.errors.confirmPassword && (
                                <div
                                  className="fw-light mt-1"
                                  style={{ fontSize: "12px" }}
                                >
                                  <span role="alert" className="text-danger">
                                    {formik.errors.confirmPassword}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="row ms-2 me-2 mt-3">
                        <div className="col-12">
                          <button
                            type="submit"
                            className="btn btn-primary waves-effect waves-light w-100"
                            disabled={formik.isSubmitting}
                          >
                            {!loading ? (
                              <span className="indicator-label">
                                <span className="bi bi-key"></span> Change
                              </span>
                            ) : (
                              <span
                                className="indicator-progress"
                                style={{ display: "block" }}
                              >
                                Please wait.....
                                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12 text-center mt-3">
                          <p>
                            <span className="fw-bold">Not you ? &nbsp;</span>{" "}
                            <Link to={"#"} onClick={handleLogout}>
                              Please Login
                            </Link>
                          </p>
                          <p className="fw-light h6 text-success fs-10 fst-italic mt-2">
                            {" "}
                            ---- The People’s Bank, The People’s Choice ----
                          </p>
                        </div>
                      </div>
                      <div className="row mt-5">
                        <div className="col-12 text-center">
                          <p className="mb-0">
                            © {new Date().getFullYear()} &nbsp;{" "}
                            <span className="fw-bold text-dark">PBZ BANK</span>
                          </p>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};
