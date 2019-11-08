import axios from 'axios';
import * as actionTypes from '../actions/types';
import { setAlert } from './alert';

// Get posts
export const getPosts = () => async dispatch => {
  try {
    const response = await axios.get('/api/posts');
    dispatch({ type: actionTypes.GET_POSTS, payload: response.data });
  } catch (error) {
    dispatch({
      type: actionTypes.POST_ERROR,
      payload: { msg: error.response.text, status: error.response.status },
    });
  }
};
