import * as actions from "./actionTypes";

const initialState = {
  signUser: {},
  signToken: {},
  signStaff: {},
  signSystem: {},
  signRole: [],
  isAuthenticated: null,
  isLocked: null,
};

const authReducers = (state = initialState, action) => {
  switch (action.type) {
    case actions.getToken:
      return {
        ...state,
        signToken: action.payload,
      };

    case actions.getUser:
      return {
        ...state,
        signUser: action.payload,
      };

    case actions.getStaff:
      return {
        ...state,
        signStaff: action.payload,
      };

    case actions.getSystem:
      return {
        ...state,
        signSystem: action.payload,
      };

    case actions.getRole:
      return {
        ...state,
        signRole: action.payload,
      };

    case actions.setAuth:
      return {
        ...state,
        isAuthenticated: action.payload,
      };

    case actions.setLock:
      return {
        ...state,
        isLocked: action.payload,
      };

    default:
      return state;
  }
};

export default authReducers;
