import * as actionTypes from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case actionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
      };
    case actionTypes.LOGIN_SUCCESS:
    case actionTypes.CONFIRM_EMAIL:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case actionTypes.AUTH_ERROR:
    case actionTypes.REGISTER_FAIL:
    case actionTypes.LOGIN_FAIL:
    case actionTypes.LOGOUT:
    case actionTypes.ACCOUNT_DELETED:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };

    default:
      return state;
  }
};

export default auth;
