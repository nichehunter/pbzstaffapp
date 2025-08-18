import { useEffect, useState } from "react";
import { Card } from "antd";
import ReactCodeInput from "react-code-input";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCountdown } from "../../../context/CountdownContext";
import { useAuth } from "../../../context/AuthContext";
import { authActions } from "../../../actions/auth";
import { char } from "../../../utils";

export const LockScreen = () => {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(3);
  const [otpCode, setOtpCode] = useState("");
  const { minutes, seconds, isValid, isActive, stopCountdown, startCountdown } =
    useCountdown();
  const { otp } = useAuth();
  const dispatch = useDispatch();
  let navigate = useNavigate();

  useEffect(() => {
    startCountdown(otp.time);
    if (!otp.isOTP) {
      localStorage.removeItem("persist:root");
      navigate("/", { replace: true });
      document.location.reload();
    }
  }, [otp]);

  const from = localStorage.getItem("fromPath") || "/home";

  useEffect(() => {
    if (otpCode.length === 6) {
      if (otpCode === otp.otp) {
        dispatch(authActions.setAuth(true));
        dispatch(authActions.setLock(null));
        navigate(from);
        stopCountdown();
      } else {
        setOtpCode("");
        setAttempts((prev) => prev - 1);
        if (attempts - 1 <= 0) {
          stopCountdown();
          setIsError(true);
          setError(`Sorry.....! You have finish your attempts`);
          const timer = setTimeout(() => {
            localStorage.removeItem("persist:root");
            navigate("/", { replace: true });
            document.location.reload();
          }, 2000);

          return () => clearTimeout(timer);
        } else {
          setIsError(true);
          setError(`Invalid OTP. You have ${attempts - 1} attempts left.`);
        }
      }
    }
  }, [otpCode]);

  useEffect(() => {
    if (isError) {
      // Set a timeout to hide the div after 5 seconds (5000 milliseconds)
      const timer = setTimeout(() => {
        setIsError(false);
      }, 3000);

      // Cleanup the timeout if the component is unmounted before the timeout finishes
      return () => clearTimeout(timer);
    }
  }, [isError]);

  const handleLogout = () => {
    localStorage.removeItem("persist:root");
    navigate("/", { replace: true });
    document.location.reload();
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-4 col-sm-12"></div>
          <div className="col-md-4 col-sm-12 position-absolute top-50 start-50 translate-middle">
            <Card bordered={false}>
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
                      <p className="text-center h4 mt-3 fw-bold ff-primary">
                        LOCK SCREEN
                      </p>
                      {isError ? (
                        <div className="alert alert-danger mt-3">
                          <div className="h6 text-danger alert-text mt-2 fs-14 text-center">
                            {error}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <hr />
                      <div className="row ms-5 me-5 mt-3">
                        <div className="col-12">
                          <div className="form-group text-center fs-2">
                            <ReactCodeInput
                              id="pinCode"
                              type="text"
                              fields={6}
                              onChange={(e) => {
                                setOtpCode(char.toUpperCase(e));
                              }}
                              value={char.toUpperCase(otpCode)}
                            />
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-12 text-center mt-3">
                          {isValid && isActive ? (
                            <p>
                              <span className="fw-bold">
                                Remaining Time &nbsp;{" "}
                              </span>{" "}
                              <span className="h6 fs-16">
                                {minutes} : {seconds}
                              </span>
                            </p>
                          ) : !isValid ? (
                            handleLogout()
                          ) : null}
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-12 text-center mt-3">
                          <p>
                            <span className="fw-bold">Not you ? &nbsp;</span>{" "}
                            <Link to={"#"} onClick={handleLogout}>
                              Please Login
                            </Link>
                          </p>
                        </div>
                      </div>
                      <div className="row mt-5">
                        <div className="col-12 text-center">
                          <p className="mb-0">
                            © {new Date().getFullYear()} &nbsp;{" "}
                            <span className="fw-bold text-dark">PBZ BANK</span>
                          </p>
                          <p className="fw-light h6 text-success fs-10 fst-italic mt-2">
                            {" "}
                            ---- The People’s Bank, The People’s Choice ----
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className="col-md-4 col-sm-12"></div>
        </div>
      </div>
    </>
  );
};
