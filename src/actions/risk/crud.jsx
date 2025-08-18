import axios from "axios";
import { risk, riskDictionary } from "../../api";

const apiUrl = risk;
const dictUrl = riskDictionary;

//======================================================= dictionary =======================================================================
export function loadRiskDictionaryData(pageLimit, page, search, id) {
  return axios.get(
    `${dictUrl}/dictionary/item/parent?limit=${pageLimit}&offset=${page}&dictionary__id=${id}&search=${search}`
  );
}

//=================================================== incidence ============================================================================

export function loadInstance(pageLimit, page, search, order) {
  return axios.get(
    `${apiUrl}/incidence/list?limit=${pageLimit}&offset=${page}&search=${search}&ordering=${order}`
  );
}

export function loadMyIncidence(pageLimit, page, staff, search, order) {
  return axios.get(
    `${apiUrl}/incidence/list?limit=${pageLimit}&offset=${page}&recorded_by__in=${staff}&search=${search}&ordering=${order}`
  );
}

export function loadInstanceById(id) {
  return axios.get(`${apiUrl}/incidence/details/${id}`);
}

export function addIncidence(data) {
  return axios.post(`${apiUrl}/incidence`, data);
}
