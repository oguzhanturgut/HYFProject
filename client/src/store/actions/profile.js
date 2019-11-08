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

// Add experience
export const addExperience = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.put('/api/profile/experience', formData, config);

    dispatch({ type: actionTypes.UPDATE_PROFILE, payload: response.data });
    dispatch(setAlert('Experience added', 'success'));

    history.push('/dashboard');
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

// Add education
export const addEducation = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.put('/api/profile/education', formData, config);

    dispatch({ type: actionTypes.UPDATE_PROFILE, payload: response.data });
    dispatch(setAlert('Education added', 'success'));

    history.push('/dashboard');
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

//Delete experience
export const deleteExperience = id => async dispatch => {
  try {
    const response = await axios.delete(`/api/profile/experience/${id}`);
    dispatch({ type: actionTypes.UPDATE_PROFILE, payload: response.data });
    dispatch(setAlert('Experience deleted', 'success'));
  } catch (error) {
    dispatch({
      type: actionTypes.PROFILE_ERROR,
      payload: { msg: error.response.text, status: error.response.status },
    });
  }
};

//Delete education
export const deleteEducation = id => async dispatch => {
  try {
    const response = await axios.delete(`/api/profile/education/${id}`);
    dispatch({ type: actionTypes.UPDATE_PROFILE, payload: response.data });
    dispatch(setAlert('Education deleted', 'success'));
  } catch (error) {
    dispatch({
      type: actionTypes.PROFILE_ERROR,
      payload: { msg: error.response.text, status: error.response.status },
    });
  }
};

// Delete account and profile
export const deleteAccount = () => async dispatch => {
  if (window.confirm('Are you sure? This can not be undone!')) {
    try {
      const response = await axios.delete('/api/profile');

      dispatch({ type: actionTypes.CLEAR_PROFILE });
      dispatch({ type: actionTypes.ACCOUNT_DELETED });
      dispatch(setAlert('Account deleted permanently', 'danger'));
    } catch (error) {
      dispatch({
        type: actionTypes.PROFILE_ERROR,
        payload: { msg: error.response.text, status: error.response.status },
      });
    }
  }
};
