const requestLogInType = "REQUEST_LOGIN";
const receiveLogInType = "RECEIVE_LOGIN";
const initialState = {
  isLoading: false,
  errorMessage: []
};

export const actionCreators = {
  requestLogIn: isLoaded => async (dispatch, getState) => {
    if (isLoaded === getState().login.isLoaded) {
      // Don't issue a duplicate request (we already have or are loading the requested
      // data)
      return;
    }
    dispatch({
      type: requestLogInType,
      isLoaded
    });
    loadData(dispatch, isLoaded, getState().changePassword.errorMessage);
  }
};

export const reducer = (state, action) => {
  state = state || initialState;
  if (action.type === requestLogInType) {
    return {
      ...state,
      isLoading: true,
      isLoaded: action.isLoaded
    };
  }

  if (action.type === receiveLogInType) {
    return {
      ...state,
      isLoading: false,
      isLoaded: action.isLoaded,
      errorMessage: action.errorMessage
    };
  }

  return state;
};
