import axios from 'axios';
import { setAlert } from './alert';
import * as actionTypes from './types';
import setAuthToken from '../../utils/setAuthToken';

// Load User
export const loadUser = () => async dispatch => {
  localStorage.token && setAuthToken(localStorage.token);

  try {
    const response = await axios.get('/api/auth');
    dispatch({ type: actionTypes.USER_LOADED, payload: response.data });
  } catch (error) {
    dispatch({ type: actionTypes.AUTH_ERROR });
  }
};

// Register User
export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ name, email, password });
  try {
    const response = await axios.post('/api/users', body, config);
    dispatch({ type: actionTypes.REGISTER_SUCCESS });
    dispatch(setAlert(response.data.msg, 'success'));
  } catch (error) {
    const { errors } = error.response.data;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({ type: actionTypes.REGISTER_FAIL });
  }
};

// Login user
export const login = ({ email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ email, password });
  try {
    const response = await axios.post('/api/auth', body, config);
    dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: response.data });
    dispatch(loadUser());
  } catch (error) {
    const { errors } = error.response.data;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({ type: actionTypes.LOGIN_FAIL });
  }
};

export const logout = () => dispatch => {
  dispatch({ type: actionTypes.CLEAR_PROFILE });
  dispatch({ type: actionTypes.LOGOUT });
};
