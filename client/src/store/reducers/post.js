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

    case actionTypes.DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload),
        loading: false,
      };

    case actionTypes.POST_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case actionTypes.UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === action.payload.id ? { ...post, likes: action.payload.likes } : post,
        ),
        loading: false,
      };

    default:
      return state;
  }
};

export default post;
