import { addPreferenceToStore, editPreferenceToStore, deletePreferenceToStore } from "./utils/reducerFunctions"
//ACTIONS

const ADD_PREFERENCE = "ADD_PREFERENCE";
const EDIT_PREFERENCE = "EDIT_PREFERENCE";
const DELETE_PREFERENCE = "DELTE_PREFERENCE";
const GET_PREFERENCE = "GET_PREFERENCE";
 
//Add a preference
export const addPreference = (success, data = {}, message) => {
    return {
      type: ADD_PREFERENCE,
      payload: data,
    };
};

export const editPreference = (success, data = {}, message) => {
    return {
        type: EDIT_PREFERENCE,
        payload: data,
    };
}

export const deletePreference = (success, data = {}, message) => {
    return {
        type: EDIT_PREFERENCE,
        payload: data,
    };
}

export const getPreferences = (success, data = {}, message) =>{
    return {
        type: GET_PREFERENCE,
        payload: data,
    };
}
  

const reducer = (state =[], action) =>{
    switch (action.type) {
        case ADD_PREFERENCE:
          return addPreferenceToStore(state, action.payload);
        case EDIT_PREFERENCE:
          return editPreferenceToStore(state, action.payload);
        case DELETE_PREFERENCE: {
          return deletePreferenceToStore(state, action.payload);
        }
        case GET_PREFERENCE: {
            return getPreferences(state, action.payload);
        }
        default:
          return state;
      }
}

export default reducer;