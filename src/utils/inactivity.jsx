import { useEffect, useState } from "react";
import { authActions } from "../actions/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { selector } from "../api";

export const useInactivityLogout = (logoutTime) => {
  const [lastActivityTime, setLastActivityTime] = useState(new Date());
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { getOtp } = useAuth();
  const user = selector.User();
  const system = selector.System();

  useEffect(() => {
    const handleUserActivity = () => {
      setLastActivityTime(new Date());
    };

    const checkInactivity = () => {
      const inactiveDuration = new Date() - lastActivityTime;

      if (
        inactiveDuration > logoutTime &&
        location.pathname !== "/" &&
        location.pathname !== "/lockscreen" &&
        location.pathname !== "/firstlogin" &&
        location.pathname !== "/otp"
      ) {
        // dispatch(authActions.setLock(true));
        // dispatch(authActions.setAuth(null));
        // getOtp({ email: user.email, system: system.name, time: 30 });
        // const currentPath = location.pathname;
        // localStorage.setItem("fromPath", currentPath);
        navigate("/", { replace: true });
      }
    };

    // Listen for user activity events
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    // Check inactivity periodically (adjust the interval based on your needs)
    const checkInterval = setInterval(checkInactivity, 1000); // Check every second

    // Cleanup event listeners and interval
    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      clearInterval(checkInterval);
    };
  }, [lastActivityTime, navigate, logoutTime]);
};
