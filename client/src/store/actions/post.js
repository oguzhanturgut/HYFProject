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

// Delete post
export const deletePost = postId => async dispatch => {
  try {
    const response = await axios.delete(`/api/posts/${postId}`);
    dispatch({ type: actionTypes.DELETE_POST, payload: postId });
    dispatch(setAlert('Post removed', 'success'));
  } catch (error) {
    dispatch({
      type: actionTypes.POST_ERROR,
      payload: { msg: error.response.text, status: error.response.status },
    });
  }
};

// Add post
export const addPost = formData => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post('/api/posts', formData, config);
    dispatch({ type: actionTypes.ADD_POST, payload: response.data });
    dispatch(setAlert('Post created', 'success'));
  } catch (error) {
    dispatch({
      type: actionTypes.POST_ERROR,
      payload: { msg: error.response.text, status: error.response.status },
    });
  }
};

// Get post
export const getPost = postId => async dispatch => {
  try {
    const response = await axios.get(`/api/posts/${postId}`);
    dispatch({ type: actionTypes.GET_POST, payload: response.data });
  } catch (error) {
    dispatch({
      type: actionTypes.POST_ERROR,
      payload: { msg: error.response.text, status: error.response.status },
    });
  }
};

// Add comment
export const addComment = (postId, formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post(`/api/posts/comment/${postId}`, formData, config);
    dispatch({ type: actionTypes.ADD_COMMENT, payload: response.data });
    dispatch(setAlert('Comment added', 'success'));
  } catch (error) {
    dispatch({
      type: actionTypes.POST_ERROR,
      payload: { msg: error.response.text, status: error.response.status },
    });
  }
};

// Delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
  try {
    const response = await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
    dispatch({ type: actionTypes.REMOVE_COMMENT, payload: commentId });
    dispatch(setAlert('Comment removed', 'success'));
  } catch (error) {
    dispatch({
      type: actionTypes.POST_ERROR,
      payload: { msg: error.response.text, status: error.response.status },
    });
  }
};
