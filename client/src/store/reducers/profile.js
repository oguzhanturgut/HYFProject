import * as actionTypes from '../actions/types';

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {},
};

const profile = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_PROFILE:
    case actionTypes.UPDATE_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false,
      };
    case actionTypes.GET_PROFILES:
      return {
        ...state,
        profiles: action.payload,
        loading: false,
      };
    case actionTypes.GET_REPOS:
      return {
        ...state,
        repos: action.payload,
        loading: false,
      };
    case actionTypes.PROFILE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case actionTypes.CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false,
      };
    default:
      return state;
  }
};

export default profile;
