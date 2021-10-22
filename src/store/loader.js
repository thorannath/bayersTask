const SET_LOADING_STATUS = "SET_LOADING_STATUS";

export const setLoadingStatus = (isLoading) =>({
    type: SET_LOADING_STATUS,
    isLoading
});

const reducer = (state = { isLoading: false }, action) => {
    switch (action.type) {
      case SET_LOADING_STATUS:
        return {
          ...state,
          isLoading: action.isLoading
        };
      default:
        return state;
    }
  };
  
  export default reducer;