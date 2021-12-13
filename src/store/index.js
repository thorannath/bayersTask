import { createStore, applyMiddleware, combineReducers } from "redux";
import loggerMiddleware from "redux-logger";
import thunkMiddleware from "redux-thunk";

import users, { USER_LOGGED_OUT } from './users';
import preferences from './preferences';
import labels from './labels';
import loader from './loader';
import modals from './modals';
import authenticationErrors from './authenticationErrors';

const appReducer = combineReducers({users, labels, preferences, modals, loader, authenticationErrors});

const rootReducer = (state, action) => {
    if (action.type === USER_LOGGED_OUT) {
        return appReducer(undefined, action)
    }
    return appReducer(state, action);
};

export default createStore(rootReducer, applyMiddleware(thunkMiddleware, loggerMiddleware));
