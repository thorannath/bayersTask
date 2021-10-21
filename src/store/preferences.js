import { addPreferenceToStore, editPreferenceToStore, deletePreferenceToStore, loadPreferencesToStore } from "./utils/reducerFunctions"
//ACTIONS

const ADD_PREFERENCE = "ADD_PREFERENCE";
const EDIT_PREFERENCE = "EDIT_PREFERENCE";
const DELETE_PREFERENCE = "DELTE_PREFERENCE";
const GET_PREFERENCE = "GET_PREFERENCE";
 
//Action Creators
export const addPreferenceAction = (data = {}, success=false) => {
    return {
      type: ADD_PREFERENCE,
      payload: data,
    };
};

export const editPreferenceAction = (data = {}) => {
    return {
        type: EDIT_PREFERENCE,
        payload: data,
    };
}

export const deletePreferenceAction = (preferenceId='') => {
    return {
        type: DELETE_PREFERENCE,
        payload: preferenceId,
    };
}

export const loadPreferences = (data = []) =>{
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
        case DELETE_PREFERENCE:
          return deletePreferenceToStore(state, action.payload);
        case GET_PREFERENCE: 
            return loadPreferencesToStore(state, action.payload);
        default:
          return state;
      }
}

export default reducer;