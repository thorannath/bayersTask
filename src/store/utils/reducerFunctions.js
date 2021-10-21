export const addPreferenceToStore = (state, preference) =>{
    return [...state, preference];
}

export const editPreferenceToStore = (state, preference) =>{
    let oldPreference = state.find(data=> data.id === preference.id);
    oldPreference = preference;
    return state;
}

export const deletePreferenceToStore = (state, preferenceId) =>{
    let preferences = state.filter(data=> data.id != preferenceId);
    return [...preferences];
}

export const loadPreferencesToStore = (state, preferences) => {
    return [...preferences];
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