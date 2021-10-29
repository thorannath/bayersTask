import axios from "axios";
import Cookies from "js-cookie";
import { getTreatments, getMedicalConditions } from "../labels";
import { loadPreferences, addPreferenceAction, editPreferenceAction, deletePreferenceAction } from '../preferences';
import * as constants from '../../Constant';
import { setLoadingStatus } from "../loader";

const baseURL = "http://localhost:3000/"

export const login = (credentials) => async (dispatch) => {
    try {
        const { data } = await axios.post(baseURL + "users", credentials);

        Cookies.set('userid', credentials.userid, { expires: 1, path: '/' });
        Cookies.set('password', credentials.password, { expires: 1, path: '/' });
        Cookies.set('authToken', credentials.authToken, { expires: 1, path: '/' });

    } catch (error) {
        console.error(error);
    }
}

export const register = (credentials) => async (dispatch) => {
    try {
        const { data } = await axios.post(baseURL + "users/register", credentials);


    } catch (error) {
        console.error(error);
    }
}

export const addPreference = (obj) => async (dispatch) => {
    try {
        dispatch(setLoadingStatus(true));
        const params = {
            userid: Cookies.get("userid", { path: '/' }),
            authToken: Cookies.get('authToken', { path: '/' }),
        }
        const { data } = await axios.post(baseURL + "users/preferences", { ...obj, ...params });

        if (data.success) {
            let defaultPreferenceId= obj.makeDefault?data.data.id:'';
            dispatch(addPreferenceAction({preference:data.data, defaultPreferenceId}));
        }
        dispatch(setLoadingStatus(false));
    } catch (error) {
        console.error(error);
    }
}

export const updatePreference = (obj) => async (dispatch) => {
    try {
        dispatch(setLoadingStatus(true));
        const params = {
            userid: Cookies.get("userid", { path: '/' }),
            authToken: Cookies.get('authToken', { path: '/' }),
        }
        const { data } = await axios.put(baseURL + "users/preferences", { ...obj, ...params });

        if (data.success) {
            dispatch(editPreferenceAction({preference:data.data, defaultPreferenceId:obj.makeDefault}));
        }
        dispatch(setLoadingStatus(false));
    } catch (error) {
        console.error(error);
    }
}

export const deletePreference = (preferenceId) => async (dispatch) => {
    try {
        const params = {
            userid: Cookies.get("userid", { path: '/' }),
            authToken: Cookies.get('authToken', { path: '/' }),
            preferenceId
        }
        const { data } = await axios.delete(baseURL + "users/preferences", {params});

        if (data.success) {
            dispatch(deletePreferenceAction(preferenceId));
        }
    } catch (error) {
        console.error(error);
    }
}

export const getPreferences = () => async (dispatch) => {
    try {
        const params = {
            userid: Cookies.get("userid", { path: '/' }),
            authToken: Cookies.get('authToken', { path: '/' }),
        }
        const { data } = await axios.get(baseURL + "users/preferences", { params });
        if (data.success) {
            dispatch(loadPreferences({preferences:data.preferenceData, defaultPreferenceId: data.defaultPreferenceId}));
        }

    } catch (error) {
        console.error(error);
    }
}

export const fetchLabels = () => async (dispatch) => {
    try {
        const params = {
            userid: Cookies.get("userid", { path: '/' }),
            authToken: Cookies.get('authToken', { path: '/' }),
        }
        const { data } = await axios.get(baseURL + "patientfinder/labels", { params });

        if (data.success) {
            let medicalConditions = data.labelData.filter(data => data.label_type === constants.labelTypes.MEDICAL_CONDITION);
            let treatments = data.labelData.filter(data => data.label_type === constants.labelTypes.TREATMENT);
            dispatch(getTreatments(treatments));
            dispatch(getMedicalConditions(medicalConditions));
        }
    } catch (error) {
        console.error(error);
    }
}

export const generateTreatmentGraph = (credentials) => async (dispatch) => {
    try {
        const { data } = await axios.post(baseURL + "patientfinder/treatments", credentials);


    } catch (error) {
        console.error(error);
    }
}

export const generateMedicalConditionsGraph = (credentials) => async (dispatch) => {
    try {
        const { data } = await axios.post(baseURL + "patientfinder/medicals", credentials);


    } catch (error) {
        console.error(error);
    }
}