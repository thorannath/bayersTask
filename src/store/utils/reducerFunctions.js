export const addPreferenceToStore = (state, payload) =>{
    let preferences = [...state.preferences];
    preferences.push(payload.preference);
    if(payload.defaultPreferenceId){
        let defaultPreferenceId =payload.defaultPreferenceId;
        return {...state, preferences, defaultPreferenceId};
    }

    if(preferences.length==1){
        let defaultPreferenceId = payload.preference.id;
        return {...state, preferences, defaultPreferenceId}
    }
    return {...state, preferences};
}

export const editPreferenceToStore = (state, payload) =>{
    let preferences = state.preferences;
    let index = preferences.findIndex(data=> data.id === payload.preference.id);
    if(!index) return {...state};
    preferences[index] = payload.preference;
    if(payload.defaultPreferenceId){
        let defaultPreferenceId =payload.defaultPreferenceId;
        return {...state, preferences, defaultPreferenceId};
    }
    return {...state, preferences};
}

export const deletePreferenceToStore = (state, preferenceId) =>{
    let preferences = state.preferences.filter(data=> data.id !== preferenceId);
    let defaultPreferenceId = '';
    if(preferences.length === 0){
        return {...state, preferences, defaultPreferenceId}
    }

    if(state.defaultPreferenceId === preferenceId){
        defaultPreferenceId =preferences[0].id;
        return {...state, preferences, defaultPreferenceId};
    }
    return {...state, preferences};
}

export const loadPreferencesToStore = (state, payload) => {
    if(payload.preferences.length>0){
        let preference =  payload.preferences.find(data=> data.id == payload.defaultPreferenceId);
        if(preference){
            return {preferences: payload.preferences, defaultPreferenceId: payload.defaultPreferenceId};
        }
        else{
            return {preferences: payload.preferences, defaultPreferenceId: payload.preferences[0].id};
        }
    }
    
    return {preferences:[], defaultPreferenceId:''};
}

export const loadLabelsToStore = (state, labels) =>{
    return {...state, labels}
}

export const loadTreatmentsToStore = (state, treatments) =>{
    return {...state, treatments};
}

export const loadMedicalConditionsToStore = (state, medicalConditions) =>{
    return {...state, medicalConditions};
}

export const onShowModals = (state, payload) =>{
    return {...state, messageType:payload.messageType, action:payload.action, data:payload.data}
}

export const onCloseModals = (state, payload) =>{
    return {...state, messageType:payload.messageType, action:payload.action, data:payload.data}
}