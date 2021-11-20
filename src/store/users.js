

const USER_LOGGED_IN = "USER_LOGGED_IN";
const USER_LOGGED_OUT = "USER_LOGGED_OUT";
const LOGIN_ERROR = "LOGIN_ERROR";
const REGISTER_ERROR = "REGISTER_ERROR";

//Action Creators
export const loginAction = (data = {}) => {
    return {
      type: USER_LOGGED_IN,
      payload: data,
    };
};

export const logoutAction = (data ={}) => {
    return {
        type: USER_LOGGED_OUT,
        payload: data,
    };
}

export const loginError = (message = '') => {
    return {
        type: LOGIN_ERROR,
        payload: {message}
    }
}

export const registerError = (message = '') => {
    return {
        type: REGISTER_ERROR,
        payload: {message}
    }
}

const initData = {
    isLoggedIn:false
}

const reducer = (state = {...initData}, action) =>{
    switch(action.type){
        case USER_LOGGED_IN:
            return { ...state, isLoggedIn:true};
        case USER_LOGGED_OUT:
            return { ...state, isLoggedIn:false};
        default:
            return state;
    }
}

export default reducer;