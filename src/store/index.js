import { createStore, applyMiddleware, combineReducers } from "redux";
import loggerMiddleware from "redux-logger";
import thunkMiddleware from "redux-thunk";

import users from './users';
import preferences from './preferences';

const appReducer = combineReducers({users,preferences});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default createStore(rootReducer, applyMiddleware(thunkMiddleware, loggerMiddleware));
