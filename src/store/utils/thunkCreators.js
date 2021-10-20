import axios from "axios";
import Cookies from "js-cookie";

const baseURL = "http://localhost:3000/"

export const login = (credentials) => async(dispatch) =>{
    try {
        const { data } = await axios.post(baseURL+"users", credentials);

        Cookies.set('userid', credentials.userid, {expires: 1, path:'/'}); 
        Cookies.set('password', credentials.password, {expires: 1, path:'/'});
        Cookies.set('authToken', credentials.authToken, {expires: 1, path:'/'});

      } catch (error) {
        console.error(error);
      }
}

export const register = (credentials) => async(dispatch) =>{
    
    try {
        const { data } = await axios.post(baseURL+"users/register", credentials);


    } catch (error) {
        console.error(error);
      }
}

export const fetchLabels = (credentials) => async(dispatch) =>{
    try {
        const { data } = await axios.post(baseURL+"users/register", credentials);


    } catch (error) {
        console.error(error);
      }
}

export const addPreference = (credentials) => async(dispatch) =>{

    try {
        const { data } = await axios.post(baseURL+"users/register", credentials);


    } catch (error) {
        console.error(error);
      }
}

export const updatePreference = (credentials) => async(dispatch) =>{
    try {
        const { data } = await axios.post(baseURL+"users/register", credentials);


    } catch (error) {
        console.error(error);
      }
}

export const deletePreference = (credentials) => async(dispatch) =>{
    try {
        const { data } = await axios.post(baseURL+"users/register", credentials);


    } catch (error) {
        console.error(error);
      }
}

export const getPreferences = (credentials) => async(dispatch) =>{
    try {
        const { data } = await axios.post(baseURL+"users/register", credentials);


    } catch (error) {
        console.error(error);
      }
}

export const generateTreatmentGraph = (credentials) => async(dispatch) =>{
    try {
        const { data } = await axios.post(baseURL+"users/register", credentials);


    } catch (error) {
        console.error(error);
      }
}

export const generateMedicalConditionsGraph = (credentials) => async(dispatch) =>{
    try {
        const { data } = await axios.post(baseURL+"users/register", credentials);


    } catch (error) {
        console.error(error);
      }
}