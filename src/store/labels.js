import { loadLabelsToStore, loadMedicalConditionsToStore, loadTreatmentsToStore } from "./utils/reducerFunctions";

//Actions
const GET_LABELS = "GET_LABELS";
const GET_TREATMENTS = "GET_TREATMENTS";
const GET_MEDICAL_CONDITIONS = "GET_MEDICAL_CONDITIONS";

//Action creators
export const getLabels = (data = {}) => {
    return {
      type: GET_LABELS,
      payload: data,
    };
};

export const getTreatments = (data={}) =>{
  return {
    type: GET_TREATMENTS,
    payload: data,
  };
}

export const getMedicalConditions = (data={}) =>{
  return {
    type: GET_MEDICAL_CONDITIONS,
    payload: data,
  };
}

//Reducer
const reducer = (state ={treatments:[], medicalConditions:[]}, action) =>{
    switch (action.type) {
        case GET_LABELS:
          return loadLabelsToStore(state, action.payload);
        case GET_MEDICAL_CONDITIONS:
          return loadMedicalConditionsToStore(state, action.payload);
        case GET_TREATMENTS:
          return loadTreatmentsToStore(state, action.payload);
        default:
          return state;
      }
}

export default reducer;