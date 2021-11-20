
/*Error Types*/
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILED = "LOGIN_FAILED";

export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAILED = "REGISTER_FAILED";

export const setError = ({type ='', message=''}) => ({
    type,
    message
});

const reducer = (state ={errorType:'', message:''}, action) => {
        switch(action.type){
            case LOGIN_SUCCESS:
                return {
                    ...state,
                    errorType: LOGIN_SUCCESS,
                    message:action.message
                };
            case LOGIN_FAILED:
                return {
                    ...state,
                    errorType: LOGIN_FAILED,
                    message:action.message 
                }
            case REGISTER_SUCCESS:
                return {
                    ...state,
                    errorType: REGISTER_SUCCESS,
                    message:action.message
                }
            case REGISTER_FAILED:
                return {
                    ...state,
                    errorType: REGISTER_FAILED,
                    message:action.message
                }
            default:
                return state;
        }
};

export default reducer;