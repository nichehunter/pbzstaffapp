import React, { createContext, useState, useContext } from "react";
import { char, code } from "../utils";
import { authCRUD } from "../actions/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [otp, setOtp] = useState({});
  const [email, setEmail] = useState(null);
  const [system, setSystem] = useState(null);
  const [name, setName] = useState(null);

  const getOtp = (data) => {
    setOtp({
      otp: code.otpCode(),
      time: code.lifeTime(data.time),
      isOTP: true,
    });
    setEmail(data.email);
    setSystem(data.system);
    setName(data.name);
  };

  const otpCode = otp.otp;

  if (email && system && name) {
    const emailData = {
      staff_email: email,
      staff_name: name,
      system_name: system,
      otp_code: otpCode,
    };
    authCRUD
      .sendOTPEmail(emailData)
      .then(() => {})
      .catch(() => {});
  }

  return (
    <AuthContext.Provider value={{ otp, getOtp }}>
      {children}
    </AuthContext.Provider>
  );
};
