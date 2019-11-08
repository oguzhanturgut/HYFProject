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

// Add like
export const addLike = postId => async dispatch => {
  try {
    const response = await axios.put(`/api/posts/like/${postId}`);
    dispatch({ type: actionTypes.UPDATE_LIKES, payload: { id: postId, likes: response.data } });
  } catch (error) {
    dispatch({
      type: actionTypes.POST_ERROR,
      payload: { msg: error.response.text, status: error.response.status },
    });
  }
};
//TODO only need one thumbs up button and toggle like onClick
// Remove like
export const removeLike = postId => async dispatch => {
  try {
    const response = await axios.put(`/api/posts/unlike/${postId}`);
    dispatch({ type: actionTypes.UPDATE_LIKES, payload: { id: postId, likes: response.data } });
  } catch (error) {
    dispatch({
      type: actionTypes.POST_ERROR,
      payload: { msg: error.response.text, status: error.response.status },
    });
  }
};
