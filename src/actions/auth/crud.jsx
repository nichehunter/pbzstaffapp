import axios from "axios";
import { auth, authApp } from "../../api";

const apiUrl = auth;
const appUrl = authApp

export function loadToken(user) {
  return axios.post(`${apiUrl}/auth/token`, user);
}

export function refreshToken(token) {
  return axios.post(`${apiUrl}/token/refresh/`, token);
}

export function addUser(data) {
  return axios.post(`${apiUrl}/user`, data);
}

export function updateUser(id, data) {
  return axios.put(`${apiUrl}/user/details/${id}`, data);
}

export function updateUserActive(id) {
  return axios.put(`${apiUrl}/user/active/${id}`);
}

export function updateUserNotActive(id) {
  return axios.put(`${apiUrl}/user/not/active/${id}`);
}

export function updatePassword(id, data, headers) {
  return axios.put(`${apiUrl}/user/password/${id}`, data, headers);
}

export function resetPassword(data) {
  return axios.post(`${apiUrl}/user/reset_password`, data);
}

export function loadUser(user) {
  return axios.get(`${apiUrl}/user/${user}`);
}

export function loadUserGroups() {
  return axios.get(`${apiUrl}/group`);
}

export function loadUserList(pageLimit, page, search, order) {
  return axios.get(
    `${apiUrl}/user/list?limit=${pageLimit}&offset=${page}&search=${search}&ordering=${order}`
  );
}

export function loadSingleUser(id) {
  return axios.get(`${apiUrl}/user/list?id__in=${id}`);
}

export function loadExcludeUserList(pageLimit, page, user, search, order) {
  return axios.get(
    `${apiUrl}/user/list?limit=${pageLimit}&offset=${page}&exclude_id=${user}&search=${search}&ordering=${order}`
  );
}

export function sendEmail(data) {
  return axios.post(`${apiUrl}/send-normal-email`, data);
}

export function sendOTPEmail(data) {
  return axios.post(`${apiUrl}/send-otp-email`, data);
}

export function PostActivate(id) {
  return axios.post(`${apiUrl}/user/activate/${id}`);
}

export function PostAuthorise(id) {
  return axios.post(`${apiUrl}/user/authorise/${id}`);
}

export function loadSystemUser(user, order) {
  return axios.get(
    `${appUrl}/system-user/list?user__id__in=${user}&ordering=${order}`
  );
}
