import { combineReducers } from "redux";
import { authReducers } from "../actions/auth";

export const rootReducer = combineReducers({
  authReducer: authReducers,
});
