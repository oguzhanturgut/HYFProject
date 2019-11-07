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
