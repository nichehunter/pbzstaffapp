import { selector } from "../api";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const isAuth = selector.Auth();
  const isLock = selector.Lock();

  if (!isAuth && !isLock) {
    return <Navigate to="/" replace />;
  } else if (!isAuth && isLock) {
    return <Navigate to="/lockscreen" replace />;
  }

  return children;
}
