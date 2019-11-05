import axios from 'axios';
import { setAlert } from './alert';
import * as actionTypes from './types';

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
    dispatch({ type: actionTypes.REGISTER_SUCCESS, payload: response.data });
  } catch (error) {
    const { errors } = error.response.data;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({ type: actionTypes.REGISTER_FAIL });
  }
};
