import { createStore, applyMiddleware, combineReducers } from "redux";
import loggerMiddleware from "redux-logger";
import thunkMiddleware from "redux-thunk";

import users from './users';
import preferences from './preferences';
import labels from './labels';
import loader from './loader';

const appReducer = combineReducers({users, labels, preferences, loader});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default createStore(rootReducer, applyMiddleware(thunkMiddleware, loggerMiddleware));
