import * as actionTypes from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {},
};

const post = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false,
      };

    case actionTypes.POST_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default post;
