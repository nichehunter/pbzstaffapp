import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import MasterLayout from "../layout";
import { FirstLogin, Lock, Login, OTP, Reset } from "../pages/auth";
import Home from "../pages/home";
import { useInactivityLogout } from "../utils";
import { Errors404 } from "../pages/error";
import { Incidence } from "../pages/risk";
import Profile from "../pages/profile";
import Leave from "../pages/leave";
import Financing from "../pages/financing";
import KPI from "../pages/kpi";

export default function Routers() {
  const logoutTime = 5 * 60 * 1000;

  useInactivityLogout(logoutTime);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/lockscreen" element={<Lock />} />
        <Route exact path="/firstlogin" element={<FirstLogin />} />
        <Route exact path="/otp" element={<OTP />} />
        <Route exact path="/reset" element={<Reset />} />
        <Route path="*" element={<Errors404 />} />
        <Route element={<MasterLayout />}>
          <Route
            exact
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/leave"
            element={
              <PrivateRoute>
                <Leave />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/finance"
            element={
              <PrivateRoute>
                <Financing />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/kpi"
            element={
              <PrivateRoute>
                <KPI />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/risk"
            element={
              <PrivateRoute>
                <Incidence />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}
