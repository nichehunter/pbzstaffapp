import axios from "axios";
import { hrms } from "../../api";

const apiUrl = hrms;

//==================================================================== staff ===============================================================
export function loadStaffData(staff) {
  return axios.get(`${apiUrl}/staff/data/${staff}`);
}
export function loadStaffDetails(id) {
  return axios.get(`${apiUrl}/staff/details/${id}`);
}

export function updateStaff(id, data) {
  return axios.put(`${apiUrl}/staff/update/${id}`, data);
}

export function loadSupervisor(
  pageLimit,
  page,
  staff_id,
  active,
  search,
  order
) {
  return axios.get(
    `${apiUrl}/supervisor/list?limit=${pageLimit}&offset=${page}&staff__id=${staff_id}&is_active=${active}&search=${search}&ordering=${order}`
  );
}

export function loadSupervisorStaff(
  pageLimit,
  page,
  department,
  branch,
  active,
  search,
  order
) {
  return axios.get(
    `${apiUrl}/supervisor/staff/list?limit=${pageLimit}&offset=${page}&department__id__in=${department}&branch__id__in=${branch}&is_active=${active}&search=${search}&ordering=${order}`
  );
}

export function loadStaffCount(type, branch, department) {
  return axios.get(
    `${apiUrl}/supervisor/staff/count/${type}/${branch}/${department}`
  );
}

export function loadStaffBranch(
  pageLimit,
  page,
  staff_id,
  active,
  search,
  order
) {
  return axios.get(
    `${apiUrl}/staff/branch/details?limit=${pageLimit}&offset=${page}&staff__id=${staff_id}&is_active=${active}&search=${search}&ordering=${order}`
  );
}

export function loadStaffDocument(pageLimit, page, staff_id, search, order) {
  return axios.get(
    `${apiUrl}/document/list?limit=${pageLimit}&offset=${page}&staff__id=${staff_id}&search=${search}&ordering=${order}`
  );
}

export function addStaffDocument(data) {
  return axios.post(`${apiUrl}/document`, data);
}

export function loadStaffQualification(
  pageLimit,
  page,
  staff_id,
  search,
  order
) {
  return axios.get(
    `${apiUrl}/staff-qualification/list?limit=${pageLimit}&offset=${page}&staff__id=${staff_id}&search=${search}&ordering=${order}`
  );
}

export function addStaffQualification(data) {
  return axios.post(`${apiUrl}/staff-qualification`, data);
}

//===================================================================== dictionary =================================================================
export function loadDictionaryData(pageLimit, page, search, id) {
  return axios.get(
    `${apiUrl}/dictionary/item/parent?limit=${pageLimit}&offset=${page}&dictionary__id=${id}&search=${search}`
  );
}

//===================================================================== department head =================================================================
export function loadDepartmentAll(department) {
  return axios.get(
    `${apiUrl}/department/all/list?parent_department__id__in=${department}`
  );
}

export function loadDepartmentByCode(code) {
  return axios.get(`${apiUrl}/department/all/list?department_code__in=${code}`);
}

export function loadBranchAll(branch) {
  return axios.get(`${apiUrl}/branch/list?parent_branch__id__in=${branch}`);
}

//===================================================================== department head =================================================================
export function loadDepartmentHead(
  pageLimit,
  page,
  department,
  active,
  search,
  order
) {
  return axios.get(
    `${apiUrl}/department-head/list?limit=${pageLimit}&offset=${page}&department__id=${department}&is_active=${active}&search=${search}&ordering=${order}`
  );
}

export function loadBranchManager(
  pageLimit,
  page,
  branch,
  active,
  search,
  order
) {
  return axios.get(
    `${apiUrl}/branch-manager/list?limit=${pageLimit}&offset=${page}&branch__id=${branch}&is_active=${active}&search=${search}&ordering=${order}`
  );
}

//===================================================================== leave roster =================================================================
export function loadRoster(pageLimit, page, search, order) {
  return axios.get(
    `${apiUrl}/roster/list?limit=${pageLimit}&offset=${page}&search=${search}&ordering=${order}`
  );
}

export function addLeaveRoster(data) {
  return axios.post(`${apiUrl}/leave-roster`, data);
}

export function loadLeaveRoster(pageLimit, page, staff, search, order) {
  return axios.get(
    `${apiUrl}/leave-roster/list?limit=${pageLimit}&offset=${page}&staff__id__in=${staff}&search=${search}&ordering=${order}`
  );
}

//===================================================================== leave application =================================================================
export function addLeaveApplication(data) {
  return axios.post(`${apiUrl}/leave-application`, data);
}

export function loadLeaveApplication(
  pageLimit,
  page,
  staff,
  active,
  search,
  order
) {
  return axios.get(
    `${apiUrl}/leave-application/list?limit=${pageLimit}&offset=${page}&staff__id__in=${staff}&is_active=${active}&search=${search}&ordering=${order}`
  );
}

export function addLeaveStatus(id, data) {
  return axios.put(`${apiUrl}/leave-status/${id}`, data);
}

export function loadLeaveDeetails(leave) {
  return axios.get(`${apiUrl}/leave-application/details/${leave}`);
}

export function addLeaveChanges(leave, data) {
  return axios.put(`${apiUrl}/leave-application/update/${leave}`, data);
}

//===================================================================== leave application =================================================================
export function addLeaveAssignment(data) {
  return axios.post(`${apiUrl}/leave-assignment`, data);
}

export function addLeaveFoward(data) {
  return axios.post(`${apiUrl}/leave-foward`, data);
}

export function loadLeaveAssignmentCount(staff) {
  return axios.get(`${apiUrl}/supervisor/assignment/count/${staff}`);
}

export function loadLeaveAssignment(pageLimit, page, staff, search, order) {
  return axios.get(
    `${apiUrl}/leave-assignment/list?limit=${pageLimit}&offset=${page}&assigned_to__id=${staff}&is_active=true&search=${search}&ordering=${order}`
  );
}

//===================================================================== leave comment =================================================================
export function addLeaveComment(data) {
  return axios.post(`${apiUrl}/leave-comment`, data);
}

//===================================================================== leave approval =================================================================
export function addLeaveApproval(data) {
  return axios.post(`${apiUrl}/leave-approval`, data);
}

//===================================================================== leave approval =================================================================
export function addLeaveReject(data) {
  return axios.post(`${apiUrl}/leave-rejected`, data);
}

//===================================================================== leave type =================================================================
export function loadLeaveType(pageLimit, page, search, order) {
  return axios.get(
    `${apiUrl}/leave-type/list?limit=${pageLimit}&offset=${page}&search=${search}&ordering=${order}`
  );
}

//===================================================================== leave duration =================================================================
export function addLeaveDuration(data) {
  return axios.post(`${apiUrl}/leave-duration`, data);
}

export function loadLeaveDuration(pageLimit, page, search, order) {
  return axios.get(
    `${apiUrl}/leave-duration/list?limit=${pageLimit}&offset=${page}&search=${search}&ordering=${order}`
  );
}

//===================================================================== leave duration =================================================================
export function loadLeaveBalance(
  pageLimit,
  page,
  staff,
  leave,
  used,
  expire,
  search,
  order
) {
  return axios.get(
    `${apiUrl}/leave-balance/list?limit=${pageLimit}&offset=${page}&staff__id=${staff}&leave_type__id=${leave}&is_used=${used}&is_expired=${expire}&search=${search}&ordering=${order}`
  );
}

//===================================================================== public holiday =================================================================
export function loadHoliday(pageLimit, page, active, search, order) {
  return axios.get(
    `${apiUrl}/holiday/list?limit=${pageLimit}&offset=${page}&is_active=${active}&search=${search}&ordering=${order}`
  );
}

//===================================================================== finance =================================================================
export function loadSalary(pageLimit, page, staff, search, order) {
  return axios.get(
    `${apiUrl}/salary/list?limit=${pageLimit}&offset=${page}&staff__id__in=${staff}&search=${search}&ordering=${order}`
  );
}

export function loadAllowance(pageLimit, page, staff, active, search, order) {
  return axios.get(
    `${apiUrl}/allowance/list?limit=${pageLimit}&offset=${page}&staff__id__in=${staff}&is_active=${active}&search=${search}&ordering=${order}`
  );
}

export function loadMonthlyAllowance(
  pageLimit,
  page,
  staff,
  date,
  active,
  search,
  order
) {
  return axios.get(
    `${apiUrl}/monthly-allowance/list?limit=${pageLimit}&offset=${page}&staff__id__in=${staff}&date__range=${date}&is_active=${active}&search=${search}&ordering=${order}`
  );
}

export function loadStaffMonthlyAllowance(staff, month, year, order) {
  return axios.get(
    `${apiUrl}/monthly-allowance/list?staff__id__in=${staff}&month_consumed__in=${month}&year__in=${year}&ordering=${order}`
  );
}

export function loadDeduction(pageLimit, page, staff, active, search, order) {
  return axios.get(
    `${apiUrl}/deduction/list?limit=${pageLimit}&offset=${page}&staff__id__in=${staff}&is_active=${active}&search=${search}&ordering=${order}`
  );
}

export function loadMonthlyDeduction(
  pageLimit,
  page,
  staff,
  date,
  active,
  search,
  order
) {
  return axios.get(
    `${apiUrl}/monthly-deduction/list?limit=${pageLimit}&offset=${page}&staff__id__in=${staff}&date__range=${date}&is_active=${active}&search=${search}&ordering=${order}`
  );
}

export function loadStaffMonthlyDeduction(staff, month, year, order) {
  return axios.get(
    `${apiUrl}/monthly-deduction/list?staff__id__in=${staff}&month_consumed__in=${month}&year__in=${year}&ordering=${order}`
  );
}

export function loadOrganization(
  pageLimit,
  page,
  staff,
  active,
  search,
  order
) {
  return axios.get(
    `${apiUrl}/organization/list?limit=${pageLimit}&offset=${page}&staff__id__in=${staff}&is_active=${active}&search=${search}&ordering=${order}`
  );
}

export function loadPayroll(pageLimit, page, staff, search, order) {
  return axios.get(
    `${apiUrl}/payroll/list?limit=${pageLimit}&offset=${page}&staff__id__in=${staff}&search=${search}&ordering=${order}`
  );
}

export function loadStaffPayroll(payroll, staff) {
  return axios.get(
    `${apiUrl}/staff-payroll/list?payroll__id__in=${payroll}&staff__id__in=${staff}`
  );
}

//==================================================================== staff ===============================================================
export function loadStaffKPI(pageLimit, page, department, branch, level, search, order) {
  const params = new URLSearchParams({
    limit: pageLimit,
    offset: page,
    department__id: department,
    banch__id: branch,
    level__id: level,
    search: search,
    ordering: order,
  });

  return axios.get(`${apiUrl}/kpi/list?${params.toString()}`);
}

export function loadStaffKPIActive(kpi) {
  return axios.get(`${apiUrl}/kpi-active/${kpi}`);
}
export function loadStaffKPINotActive(kpi, staff) {
  return axios.get(`${apiUrl}/kpi-notactive?kpi_id=${kpi}&staff_id=${staff}`);
}

export function addStaffKPI(data) {
  return axios.post(`${apiUrl}/staff-kpi`, data);
}