import { useEffect, useState } from "react";
import { Card, Input } from "antd";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authCRUD } from "../../../actions/auth";
import { Message, useToaster } from "rsuite";
import { char, code } from "../../../utils";

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
                : user.first_name
            );

            const data = { username, new_password: password };

            const emailData = {
              email: user.email,
              subject: "Password Reset",
              message: `
              <html>
                <body>
                  <p>Dear ${char.toUpperCase(
                    user?.first_name + " " + user?.last_name
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
                  { placement: "topEnd", duration: 7000 }
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
                      : "Invalid credentials"
                  );
                }
              });
          })
          .catch((error) => {
            if (error) {
              setStatus(
                error.response
                  ? error.response.data.error
                  : "You are not active user"
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
                <div className="row">
                  <div className="col-12">
                    <p className="text-center h3 fw-bold mt-3">
                      The People's Bank of Zanzibar
                    </p>
                    <p className="text-center h2 mt-3 fw-bold">
                      {"Staff Portal"}
                    </p>
                    <p className="text-center h5 mt-3 fw-bold">
                      Reset Password
                    </p>
                    {formik.status ? (
                      <div className="alert alert-danger mt-3">
                        <div className="h6 text-danger alert-text mt-2 fs-14 text-center">
                          {formik.status}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <hr />
                    <form onSubmit={formik.handleSubmit}>
                      <div className="row ms-2 me-2">
                        <div className="col-12">
                          <div className="form-group">
                            <label className="form-label">
                              OPF No.
                              <span className="ms-3 text-danger">*</span>
                            </label>
                            <Input
                              size="large"
                              placeholder="OPF Number"
                              {...formik.getFieldProps("username")}
                              status={
                                formik.touched.username &&
                                formik.errors.username &&
                                "error"
                              }
                            />
                            {formik.touched.username &&
                              formik.errors.username && (
                                <div
                                  className="fw-light mt-1"
                                  style={{ fontSize: "15px" }}
                                >
                                  <span role="alert" className="text-danger">
                                    {formik.errors.username}
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
                            className="btn btn-primary shadow-none w-100"
                            disabled={formik.isSubmitting || !formik.isValid}
                          >
                            {!loading ? (
                              <span className="indicator-label">
                                <span className="bi bi-shield-lock"></span>{" "}
                                Reset
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
                      <hr />
                      <div className="row">
                        <div className="col-12 text-center mt-3">
                          <p>
                            <span className="fw-bold">Not you ? &nbsp;</span>{" "}
                            <button
                              className="btn btn-link text-decoration-none text-info"
                              onClick={() => {
                                localStorage.removeItem("persist:root");
                                navigate("/", { replace: true });
                              }}
                            >
                              Please Login
                            </button>
                          </p>
                        </div>
                      </div>
                      <div className="row mt-5">
                        <div className="col-12 text-center">
                          <p className="mb-0">
                            © {new Date().getFullYear()} &nbsp;{" "}
                            <span className="fw-bold text-info">PBZ BANK</span>
                          </p>
                          <p className="fw-light h6 text-success fs-10 fst-italic mt-2">
                            {" "}
                            ---- The People’s Bank, The People’s Choice ----
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
