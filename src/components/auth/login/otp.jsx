import { useEffect, useState } from "react";
import { Card } from "antd";
import ReactCodeInput from "react-code-input";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCountdown } from "../../../context/CountdownContext";
import { useAuth } from "../../../context/AuthContext";
import { authActions } from "../../../actions/auth";
import { char } from "../../../utils";
import "./styles/otp.css";

export const AuthOTP = () => {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [attempts, setAttempts] = useState(3);
  const { minutes, seconds, isValid, isActive, stopCountdown, startCountdown } =
    useCountdown();
  const { otp } = useAuth();
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer); // cleanup
  }, []);

  useEffect(() => {
    startCountdown(otp.time);
    if (!otp.isOTP) {
      localStorage.removeItem("persist:root");
      navigate("/", { replace: true });
      document.location.reload();
    }
  }, [otp]);

  useEffect(() => {
    if (otpCode.length === 6) {
      if (otpCode === otp.otp) {
        dispatch(authActions.setAuth(true));
        navigate("/home");
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
      <div className="pbz-otp-page">
        <div className="pbz-otp-layout">
          {/* ================================
        LEFT BRAND PANEL
    ================================= */}

          <section className="pbz-otp-brand">
            <div className="pbz-otp-pattern" />

            <div className="pbz-otp-brand-content">
              <div className="pbz-otp-brand-top">
                <img
                  src="assets/images/logo/pbz1.png"
                  alt="People's Bank of Zanzibar"
                  className="pbz-otp-brand-logo"
                />

                <div className="pbz-otp-badge">STAFF PORTAL</div>
              </div>

              <div className="pbz-otp-brand-message">
                <span className="pbz-otp-overline">SECURE EMPLOYEE ACCESS</span>

                <h1>
                  Protecting your
                  <br />
                  <span>PBZ account.</span>
                </h1>

                <p>
                  An additional verification step helps keep your employee
                  information and account secure.
                </p>

                <div className="pbz-otp-security-list">
                  <div className="pbz-otp-security-item">
                    <div className="pbz-otp-security-icon">
                      <span className="bi bi-shield-lock" />
                    </div>

                    <div>
                      <strong>Secure verification</strong>
                      <span>Verify your identity before continuing.</span>
                    </div>
                  </div>

                  <div className="pbz-otp-security-item">
                    <div className="pbz-otp-security-icon">
                      <span className="bi bi-person-check" />
                    </div>

                    <div>
                      <strong>Staff account protection</strong>
                      <span>Your employee information remains protected.</span>
                    </div>
                  </div>

                  <div className="pbz-otp-security-item">
                    <div className="pbz-otp-security-icon">
                      <span className="bi bi-check2-circle" />
                    </div>

                    <div>
                      <strong>One-time verification</strong>
                      <span>
                        Your verification code can only be used for this login.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pbz-otp-brand-footer">
                <div>
                  <strong>The People's Bank of Zanzibar</strong>

                  <span>The People's Bank, The People's Choice</span>
                </div>

                <div className="pbz-otp-clock">
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
        OTP AREA
    ================================= */}

          <section className="pbz-otp-side">
            <div className="pbz-otp-card">
              {/* TOP */}
              <div className="pbz-otp-card-top">
                <span className="pbz-otp-card-label">STAFF PORTAL</span>

                <div className="pbz-otp-secure">
                  <span className="bi bi-shield-check" />
                  Secure
                </div>
              </div>

              {/* ICON */}
              <div className="pbz-otp-main-icon">
                <div className="pbz-otp-icon-circle">
                  <span className="bi bi-phone" />
                </div>
              </div>

              {/* HEADING */}
              <div className="pbz-otp-heading">
                <h2>Verify your identity</h2>

                <p>
                  Enter the six-digit verification code sent to your registered
                  contact.
                </p>
              </div>

              {/* ERROR */}
              {isError && (
                <div className="pbz-otp-alert">
                  <span className="bi bi-exclamation-circle-fill" />

                  <div>
                    <strong>Verification unsuccessful</strong>

                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* OTP INPUT */}
              <div className="pbz-otp-input-section">
                <label>Verification Code</label>

                <div className="pbz-otp-input-wrapper">
                  <ReactCodeInput
                    id="pinCode"
                    type="text"
                    fields={6}
                    onChange={(value) => {
                      setOtpCode(char.toUpperCase(value));
                    }}
                    value={char.toUpperCase(otpCode)}
                  />
                </div>
              </div>

              {/* TIMER */}
              <div className="pbz-otp-timer-section">
                {isValid && isActive ? (
                  <>
                    <span className="bi bi-clock" />

                    <span className="pbz-otp-timer-label">Code expires in</span>

                    <strong>
                      {minutes} : {seconds}
                    </strong>
                  </>
                ) : !isValid ? (
                  handleLogout()
                ) : null}
              </div>

              {/* INFORMATION */}
              <div className="pbz-otp-info">
                <span className="bi bi-info-circle" />

                <p>
                  Enter the verification code exactly as received. Do not share
                  this code with anyone.
                </p>
              </div>

              {/* LOGIN AGAIN */}
              <div className="pbz-otp-login-again">
                <span>Not your account?</span>

                <Link to="#" onClick={handleLogout}>
                  Sign in again
                  <span className="bi bi-arrow-right" />
                </Link>
              </div>

              {/* FOOTER */}
              <div className="pbz-otp-card-footer">
                <div className="pbz-otp-footer-links">
                  <span>PBZ Staff Portal</span>
                  <i>•</i>
                  <span>Secure Verification</span>
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
