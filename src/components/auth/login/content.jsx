import { useEffect, useState } from "react";
import { Card, Checkbox, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { authActions, authCRUD } from "../../../actions/auth";
import { useAuth } from "../../../context/AuthContext";
import { char } from "../../../utils";

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
                    resp?.data?.user?.last_name
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
                  : "Invalid credentials"
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
            <p className="h1 fw-bold text-center mb-4">The People's Bank of Zanzibar</p>
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
                    <p className="text-center h2 mt-3 fw-bold">Staff Portal</p>
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
                            <label className="form-label fw-bold">
                              OPF No.{" "}
                              <span className="ms-3 text-danger">*</span>
                            </label>
                            <Input
                              size="large"
                              placeholder="Username"
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
                          <div className="form-group">
                            <label className="form-label fw-bold">
                              Password
                              <span className="ms-3 text-danger">*</span>
                            </label>
                            <Input.Password
                              iconRender={(visible) =>
                                visible ? (
                                  <EyeTwoTone />
                                ) : (
                                  <EyeInvisibleOutlined />
                                )
                              }
                              size="large"
                              placeholder="Password"
                              {...formik.getFieldProps("password")}
                              status={
                                formik.touched.password &&
                                formik.errors.password &&
                                "error"
                              }
                            />
                            {formik.touched.password &&
                              formik.errors.password && (
                                <div
                                  className="fw-light mt-1"
                                  style={{ fontSize: "15px" }}
                                >
                                  <span role="alert" className="text-danger">
                                    {formik.errors.password}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="row ms-2 me-2 mt-3">
                        <div className="col-md-6">
                          <Checkbox>Remember me</Checkbox>
                        </div>
                        <div className="col-md-6 text-end">
                          <Link to={"/reset"}>Forget Password</Link>
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
                                <span className="bi bi-box-arrow-in-right"></span>{" "}
                                Login
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
