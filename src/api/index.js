import * as selector from "./selector";
import { Headers } from "./header";

const hrmsUrl = process.env.REACT_APP_HRMS_URL;
const authUrl = process.env.REACT_APP_AUTH_URL;
const riskUrl = process.env.REACT_APP_RISK_URL;

const auth = `${authUrl}/auth/api`;
const authApp = `${authUrl}/app/api`;
const hrms = `${hrmsUrl}/gateway/api`;
const risk = `${riskUrl}/incidence/api`;
const riskDictionary = `${riskUrl}/dictionary/api`;

export { auth, authApp, hrms, risk, riskDictionary, selector, Headers };
