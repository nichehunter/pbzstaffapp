import { useSelector } from "react-redux";

export const User = () => {
  const user = useSelector((state) => state.authReducer.signUser);
  return user;
};

export const Auth = () => {
  const auth = useSelector((state) => state.authReducer.isAuthenticated);
  return auth;
};

export const Lock = () => {
  const lock = useSelector((state) => state.authReducer.isLocked);
  return lock;
};

export const Staff = () => {
  const staff = useSelector((state) => state.authReducer.signStaff);
  return staff;
};

export const Token = () => {
  const token = useSelector((state) => state.authReducer.signToken);
  return token;
};

export const AccessToken = () => {
  const access = useSelector((state) => state.authReducer.signToken.access);
  return access;
};

export const System = () => {
  const system = useSelector((state) => state.authReducer.signSystem);
  return system;
};

export const Roles = () => {
  const role = useSelector((state) => state.authReducer.signRole);
  return role;
};
