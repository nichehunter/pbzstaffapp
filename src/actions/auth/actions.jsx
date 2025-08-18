import * as actions from "./actionTypes";
//import { refreshToken } from "./crud";

export const getToken = (token) => ({
  type: actions.getToken,
  payload: token,
});

export const getUser = (user) => ({
  type: actions.getUser,
  payload: user,
});

export const getStaff = (staff) => ({
  type: actions.getStaff,
  payload: staff,
});

export const getSystem = (system) => ({
  type: actions.getSystem,
  payload: system,
});

export const getRole = (role) => ({
  type: actions.getRole,
  payload: role,
});

export const setAuth = (auth) => ({
  type: actions.setAuth,
  payload: auth,
});

export const setLock = (lock) => ({
  type: actions.setLock,
  payload: lock,
});
