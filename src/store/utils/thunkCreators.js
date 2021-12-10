import axios from "axios";
import Cookies from "js-cookie";
import { getTreatments, getMedicalConditions } from "../labels";
import { loadPreferences, addPreferenceAction, editPreferenceAction, deletePreferenceAction } from '../preferences';
import * as constants from '../../Constant';
import { setLoadingStatus } from "../loader";
import { loginAction, logoutAction } from "../users";
import { LOGIN_FAILED, REGISTER_FAILED, setError } from "../authenticationErrors";

export const login = ({ username, password }) => async (dispatch) => {
    try {
        const response = await axios.put(constants.API_URL+ "/users/login", { userid: username, password: password })
        if (response && response.data.success) {
            dispatch(loginAction());
            Cookies.set('userid', username, { expires: 1, path: '/' });
            Cookies.set('password', password, { expires: 1, path: '/' });
            Cookies.set('authToken', response.data.userData.authToken, { expires: 1, path: '/' });
        }
        else {
            throw new Error(response.data.message);
            
        }
    } catch (error) {
        dispatch(setError({ type: LOGIN_FAILED, message:"Incorrect username or password!"}))
    }
}

export const logout = () => async (dispatch) => {
    try {
        const params = {
            userid: Cookies.get("userid", { path: '/' }),
            authToken: Cookies.get('authToken', { path: '/' }),
        }
        const response = await axios.post(constants.API_URL + "/users/logout", { ...params });
        Cookies.remove("userid");
        Cookies.remove("password");
        dispatch(logoutAction());
    } catch (error) {
        console.error(error);
    }
}

export const register = ({ username, password, fullName, email }) => async (dispatch) => {
    try {
        const response = await axios.post(`${constants.API_URL}/users/register`, { userid: username, password, fullName, email })
        if (response && Number(response.data.success)) {
            dispatch(loginAction());
            Cookies.set('userid', username, { expires: 1, path: '/' });
            Cookies.set('password', password, { expires: 1, path: '/' });
            Cookies.set('authToken', response.data.userData.authToken, { expires: 1, path: '/' });
        }
        else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        dispatch(setError({errorType: REGISTER_FAILED, message:"Please fill all the details correctly"}))
    }
}

export const addPreference = (obj) => async (dispatch) => {
    try {
        dispatch(setLoadingStatus(true));
        const params = {
            userid: Cookies.get("userid", { path: '/' }),
            authToken: Cookies.get('authToken', { path: '/' }),
        }
        const { data } = await axios.post(constants.API_URL + "/users/preferences", { ...obj, ...params });

        if (data.success) {
            let defaultPreferenceId = obj.makeDefault ? data.data.id : '';
            dispatch(addPreferenceAction({ preference: data.data, defaultPreferenceId }));
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
        const { data } = await axios.put(constants.API_URL + "/users/preferences", { ...obj, ...params });

        if (data.success) {
            dispatch(editPreferenceAction({ preference: data.data, defaultPreferenceId: obj.makeDefault }));
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
        const { data } = await axios.delete(constants.API_URL + "/users/preferences", { params });

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
        const { data } = await axios.get(constants.API_URL + "users/preferences", { params });
        if (data.success) {
            dispatch(loadPreferences({ preferences: data.preferenceData, defaultPreferenceId: data.defaultPreferenceId }));
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
        const { data } = await axios.get(constants.API_URL+ "/patientfinder/labels", { params });

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