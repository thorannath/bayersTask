import React, { useState } from 'react'
import Box from '@mui/material/Box'
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { Button, TextField } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import './Preferences.css';
import CloseIcon from '@mui/icons-material/Close';
import Filters from '../PatientFinder/Filters';
import * as constants from '../../Constant';
import { useSelector, useDispatch } from 'react-redux';
import { addPreference, updatePreference } from '../../store/utils/thunkCreators';
import { useEffect } from 'react';
import { validateName } from '../common/validation';
import { closeModal } from '../../store/modals';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    overflowY: 'scroll',
    width: '40%',
    borderRadius: 3,
    bgcolor: 'background.paper',
    boxShadow: 24,
};

const CreatePreferences = (props) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const [name, setName] = useState('');
    const [defaultVal, setDefaultVal] = useState(false);
    const [formData, setFormData] = useState({});
    const [errorStatus, setErrorStatus] = useState(('initialData.saveName' || 'initialData.preferenceName') ? { error: false, message: "" } : { error: true, message: "Please fill up the form!" });

    const modalStatus = useSelector(state => state.modals);
    const preferences = useSelector(state => state.preferences.preferences);
    const defaultPreferenceId = useSelector(state => state.preferences.defaultPreferenceId);

    useEffect(() => {
        switch (modalStatus.messageType) {
            case constants.MESSAGE_TYPES.CREATE_PREFERENCE:
                modalStatus.action === 'open'? setOpen(true):setOpen(false);
                break;

            case constants.MESSAGE_TYPES.EDIT_PREFERENCE:
                if (modalStatus.action === 'open') {
                    let data = loadPreferenceForm(modalStatus.data.id);
                    setFormData({...data});
                    setName(data.preferenceName);
                    setDefaultVal((defaultPreferenceId === data.id) ? true : false);
                    setOpen(true);
                }
                else {
                    setOpen(false);
                }
                break;
            default:
                break;
        }
    }, [modalStatus]);

    const loadPreferenceForm = (id) => {
        let preference = preferences.find(data => data.id === id);
        if (!preference) return null;
        console.log(preference)
        let jsonData = preference.jsonData;
        const data = {
            preferenceId: preference.id,
            preferenceName: preference.saveName,
            groupBy: jsonData.group_condition.group_by,
            states: jsonData.states.map(data => { return { value: data, label: constants.AcronymToStateNames[data] } }),
            cohorts: { ckd: false, diab: false, both: false },
            payType: { MCR: false, COM: false },
         };
        if (jsonData.group_condition.group_by === 'cohort') {
            for (const [type] of Object.entries(data.cohorts)) {
                if (jsonData.group_condition.selection.includes(type)) {
                    data.cohorts[type] = true;
                }
            }
        }
        else {
            for (const [type] of Object.entries(data.payType)) {
                if (jsonData.group_condition.selection.includes(type)) {
                    data.payType[type] = true;
                }
            }
        }
        return data;
    }


    const messageBoxId = 'create-preference-message';

    useEffect(() => {
        setDefaultVal((defaultPreferenceId === formData.id) ? true : false);
    }, [defaultPreferenceId]);


    const loader = useSelector(state => state.loader);

    const handleName = (event) => {
        /* Name Validation Checking */
        const errorStat = validateName(event.target.value);
        setErrorStatus(errorStat);
        if (errorStat.error) {
            document.getElementById(messageBoxId).firstElementChild.textContent = errorStat.message;
            document.getElementById(messageBoxId).style.visibility = "visible";
        } else {
            document.getElementById(messageBoxId).style.visibility = "hidden";
        }
        setName(event.target.value);
    }

    const handleDefault = (event) => {
        setDefaultVal(event.target.checked);
    }

    const requestObject = () => {
        const groupKeys = (formData.groupBy === constants.groupType.Cohort) ? formData.cohorts : formData.payType;
        const request = {
            saveName: name,
            makeDefault: defaultVal,
            jsonData: {
                group_condition: {
                    group_by: formData.groupBy,
                    selection: Object.keys(groupKeys).filter((e, i) => { return groupKeys[e] })
                },
                states: formData.states.map(data => data.value),
            }
        }
        return request;
    }

    const validateFormData = (formData) => {
        if (!formData) return false;

        if (
            formData.groupBy
            && (
                formData.groupBy === 'cohort' ?
                    (formData.cohorts && Object.keys(formData.cohorts).map(e => Number(formData.cohorts[e])).reduce((p, c) => p + c) > 0) :
                    (formData.payType && Object.keys(formData.payType).map(e => Number(formData.payType[e])).reduce((p, c) => p + c) > 0)
            )
            &&
            formData.states.length > 0
            &&
            !errorStatus.error
        ) {
            setName(name.trim());
            return true;
        }
        document.getElementById(messageBoxId).firstElementChild.textContent = (errorStatus.message !== "") ? errorStatus.message : "Please fill up all required.";
        document.getElementById(messageBoxId).style.visibility = "visible";
        return false;
    };


    const handleFormSubmit = async () => {
        if (!validateFormData(formData)) return;
        const req = requestObject();
        if (initialData.saveName || initialData.preferenceName) {
            if (initialData.id) {
                req.preferenceId = initialData.id;
            }
            if (initialData.preferenceId) {
                req.preferenceId = initialData.preferenceId;
            }
            dispatch(updatePreference(req));
            if (!loader.isLoading) {
                dispatch(closeModal({ messageType: constants.MESSAGE_TYPES.CREATE_PREFERENCE, action: 'close' }))
            }
        }
        else {
            dispatch(addPreference(req));
            if (!loader.isLoading) {
                dispatch(closeModal({ messageType: constants.MESSAGE_TYPES.CREATE_PREFERENCE, action: 'close' }))
            }
        }
    }

    const handleCancel = () => {
        dispatch(closeModal({ messageType: constants.MESSAGE_TYPES.CREATE_PREFERENCE, action: 'close' }));
    }

    return (
        <Modal
            open={open}
            onClose={()=> setOpen(false)}
            closeAfterTransition>
            <Box sx={style}>
                <div className="modal-header">
                    <Typography align="left" variant="h6"> Create Preferences </Typography>
                    <div className="modal-close">
                        <Button type="submit" color="inherit" onClick={handleCancel}><CloseIcon /></Button>
                    </div>
                </div>
                <div className="form">
                    <span id="create-preference-message"> Message </span>
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
                </div>
                <div className="modal-footer">
                    <Button type="submit" sx={{ width: '25%' }} variant="contained" onClick={handleFormSubmit}>Save</Button>
                    <Button type="submit" sx={{ width: '25%' }} color="warning" onClick={handleCancel}>Cancel</Button>
                </div>
            </Box>
        </Modal>
    )
}

export default CreatePreferences
