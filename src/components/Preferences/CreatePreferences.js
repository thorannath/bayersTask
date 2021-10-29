import React from 'react'
import Box from '@mui/material/Box'
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { Button, TextField } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import './Preferences.css';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Filters from '../PatientFinder/Filters';
import * as constants from '../../Constant';
import { useSelector, useDispatch } from 'react-redux';
import { addPreference, updatePreference } from '../../store/utils/thunkCreators';
import { useEffect } from 'react';
import { validateName } from '../common/validation';
import { closeModal, showModal } from '../../store/modals';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    overflowY: 'scroll',
    width: '40%',
    height: '75%',
    borderRadius: 2,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
};

const CreatePreferences = (props) => {
    const dispatch = useDispatch();

    const initialData = props.loadFormData;
    const [name, setName] = useState(props.loadFormData.preferenceName);
    const [defaultVal, setDefaultVal] = useState(false);
    const [formData, setFormData] = useState({ ...initialData });
    const [errorStatus, setErrorStatus] = useState((initialData.saveName || initialData.preferenceName )?{error: false, message: ""}:{error: true, message: "Please fill up the form!"});

    const treatments = useSelector(state=> state.labels.treatments);
    const medicalConditions = useSelector(state=> state.labels.medicalConditions);
    const modalStatus = useSelector(state=> state.modals);
    const preferences = useSelector(state=> state.preferences.preferences);


    useEffect(() => {
        switch(modalStatus.messageType){
            case constants.MESSAGE_TYPES.EDIT_PREFERENCE:
                if(modalStatus.action === 'open'){
                    let preference = preferences.find(val=> val.id === modalStatus.data.id);
                    initialData.id = preference.id;
                    initialData.saveName = preference.preferenceName;
                }
                break;
            default:
                break;
        }
    }, [modalStatus])
    const defaultPreferenceId = useSelector(state => state.preferences.defaultPreferenceId);
    const messageBoxId = 'create-preference-message';
 
    useEffect(() => {
        let defaultVal = (defaultPreferenceId === initialData.id)?true:false;
        setDefaultVal(defaultVal);
    }, [defaultPreferenceId, initialData]);


    const loader = useSelector(state => state.loader);

    const handleName = (event) => {
        
        /* Name Validation Checking */
        const errorStat = validateName(event.target.value);
        setErrorStatus(errorStat);
        if(errorStat.error){
            document.getElementById(messageBoxId).firstElementChild.textContent = errorStat.message;
            document.getElementById(messageBoxId).style.visibility = "visible";
        }else{
            document.getElementById(messageBoxId).style.visibility = "hidden";
        }
        setName(event.target.value);
    }

    const handleDefault = (event) => {
        setDefaultVal(event.target.checked);
    }

    const requestObject = () => {
        const groupKeys = (formData.groupBy === constants.groupType.Cohort) ? formData.cohorts : formData.payType;
        const treatmentLabels = treatments.map((e, i) => { return e["label"] })
        const medicalConditionLabels = medicalConditions.map((e, i) => { return e["label"] })

        const request = {
            saveName: name,
            makeDefault: defaultVal,
            jsonData: {
                group_condition: {
                    group_by: formData.groupBy,
                    selection: Object.keys(groupKeys).filter((e, i) => { return groupKeys[e] })
                },
                states: formData.states.map(data => data.value),
                treatments: {
                    labels: treatmentLabels, //selectedTreatmentLabels,
                    OR: formData.treatmentsOR ? formData.treatmentsOR.map(data => data.value) : null,
                    AND: formData.treatmentsAND ? formData.treatmentsAND.map(data => data.value) : null,
                },
                medical_conditions: {
                    labels: medicalConditionLabels, //selectedMedicalConditionLabels,
                    OR: formData.medicalConditionsOR ? formData.medicalConditionsOR.map(data => data.value) : null,
                    AND: formData.medicalConditionsAND ? formData.medicalConditionsAND.map(data => data.value) : null,
                }
            }
        }

        return request;
    }

    const validateFormData = (formData) => {
        if(!formData) return false;

        if(
            formData.groupBy 
             && (
                 formData.groupBy ==='cohort'? 
                 (formData.cohorts && Object.keys(formData.cohorts).map(e=> Number(formData.cohorts[e])).reduce((p,c)=> p+c) > 0): 
                 (formData.payType && Object.keys(formData.payType).map(e=> Number(formData.payType[e])).reduce((p,c)=> p+c) > 0)
             ) 
            &&
            /*formData.treatmentsAND.length !== 0 && formData.treatmentsOR.length !== 0 && 
            formData.medicalConditionsAND.length !== 0 && formData.medicalConditionsOR.length !== 0 &&*/
            !errorStatus.error
        ) {
            setName(name.trim());
            return true;
        }
        document.getElementById(messageBoxId).firstElementChild.textContent = (errorStatus.message!=="")?errorStatus.message:"Please fill up all required.";
        document.getElementById(messageBoxId).style.visibility = "visible";
        return false;

        return false;
    };


    const handleFormSubmit = async () => {
        if (!validateFormData(formData)) return;
        const req = requestObject();
        if (initialData.saveName || initialData.preferenceName ) {
            if(initialData.id){
                req.preferenceId = initialData.id;
            }
            if(initialData.preferenceId){
                req.preferenceId = initialData.preferenceId; 
            }
            // if(response.success){
            //     props.closeModal({type:'create', action:'add', success:true, message:'Preference Edited sucessfully' });
            // }
            // else{
            //     props.closeModal({type:'create', action:'add', success:false, message:'Unable to add preference' });
            // }
            dispatch(updatePreference(req));
            if (!loader.isLoading) {
                dispatch(closeModal({messageType:constants.MESSAGE_TYPES.CREATE_PREFERENCE, action:'close'}))
                // if (response.success) {
                // }
                // else {
                //     props.closeModal({ type: 'create', action: 'add', success: false, message: 'Unable to edit preference' });
                // }
            }
        }
        else {
            dispatch(addPreference(req));
            if (!loader.isLoading) {
                dispatch(closeModal({messageType:constants.MESSAGE_TYPES.CREATE_PREFERENCE, action:'close'}))
                // if(response.success){
                // }
                // else{
                //     props.closeModal({type:'create', action:'add', success:false, message:'Unable to add preference' });
                // }
            }

        }
    }

    const handleCancel = () => {
        dispatch(closeModal({messageType:constants.MESSAGE_TYPES.CREATE_PREFERENCE, action:'close'}));
    }

    return (
        <div>
            <Box sx={style}>
                <div align="right">
                    <Button type="submit" onClick={handleCancel}><CloseIcon /></Button>
                </div>
                <div id="create-preference-message">
                    <p> Message </p>
                </div>
                <h2> Create a Preference </h2>
                <FormGroup className="form-group">
                    <TextField
                        id="standard-basic"
                        label="Preference Name"
                        value={name}
                        onChange={handleName}
                        variant="standard" />
                </FormGroup>
                <Filters
                    formData={formData}
                    onChangeFormData={setFormData}
                />
                <FormGroup className="form-group">
                    <FormControlLabel control={<Checkbox checked={defaultVal} onChange={handleDefault} />} label="Make this as default" />
                </FormGroup>
                <div align="right">
                    <Button type="submit" sx={{ width: '25%' }} variant="contained" onClick={handleFormSubmit}>Save</Button>
                    <Button type="submit" sx={{ width: '25%' }} color="warning" onClick={handleCancel}>Cancel</Button>
                </div>
            </Box>
        </div>
    )
}

export default CreatePreferences
