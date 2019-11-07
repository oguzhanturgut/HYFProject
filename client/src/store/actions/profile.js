import axios from 'axios';
import * as actionTypes from '../actions/types';
import { setAlert } from './alert';

//Get current user profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const response = await axios.get('/api/profile/me');
    dispatch({ type: actionTypes.GET_PROFILE, payload: response.data });
  } catch (error) {
    dispatch({
      type: actionTypes.PROFILE_ERROR,
      payload: { msg: error.response.text, status: error.response.status },
    });
  }
};

//Create or update profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post('/api/profile', formData, config);

    dispatch({ type: actionTypes.GET_PROFILE, payload: response.data });
    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

    !edit && history.push('/dashboard');
  } catch (error) {
    const { errors } = error.response.data;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));

      dispatch({
        type: actionTypes.PROFILE_ERROR,
        payload: { msg: error.response.text, status: error.response.status },
      });
    }
  }
};
