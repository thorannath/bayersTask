import React, { useState } from 'react'
import Box from '@mui/material/Box'
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { Button, TextField } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import './Preferences.css';
import CloseIcon from '@mui/icons-material/Close';
import Filters from './Filters';
import * as constants from '../../Constant';
import { useSelector, useDispatch } from 'react-redux';
import { addPreference, updatePreference } from '../../store/utils/thunkCreators';
import { useEffect } from 'react';
import { validateName } from '../Common/validation';
import { closeModal } from '../../store/modals';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FormHelperText } from '@mui/material';

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

const CreatePreferences = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const initialData = {
        preferenceId: '',
        preferenceName: '',
        groupBy: constants.groupType.Cohort,
        states: [],
        cohorts: { ckd: true, diab: true, both: true },
        payType: { MCR: true, COM: true },
    }

    const [formData, setFormData] = useState(initialData);

    const [formErrors, setFormErrors] = useState({});
    
    const modalStatus = useSelector(state => state.modals);
    const preferences = useSelector(state => state.preferences.preferences);

    const [name, setName] = useState('');
    const [defaultVal, setDefaultVal] = useState(false);
    // const [errorStatus, setErrorStatus] = useState(('initialData.saveName' || 'initialData.preferenceName') ? { error: false, message: "" } : { error: true, message: "Please fill up the form!" });

    const defaultPreferenceId = useSelector(state => state.preferences.defaultPreferenceId);
    const loader = useSelector(state => state.loader);

    useEffect(() => {
        switch (modalStatus.messageType) {
            case constants.MESSAGE_TYPES.CREATE_PREFERENCE:
                modalStatus.action === 'open' ? setOpen(true) : setOpen(false);
                break;

            case constants.MESSAGE_TYPES.EDIT_PREFERENCE:
                if (modalStatus.action === 'open') {
                    let data = loadPreferenceForm(modalStatus.data.id);
                    setFormData({ ...data });
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

    useEffect(() => {
        setDefaultVal((defaultPreferenceId === formData.id) ? true : false);
    }, [defaultPreferenceId]);

    const handleName = (event) => {
        /* Name Validation Checking */
        const errorStatus = validateName(event.target.value);
        if (errorStatus.error) {

            console.log({...formErrors, 'name':errorStatus.message})
            setFormErrors({...formErrors, 'name':errorStatus.message});
        } else {
            if(formErrors.hasOwnProperty('name')) delete formErrors.name;
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

        if ( formData.groupBy
            && (
                formData.groupBy === 'cohort' ?
                    (formData.cohorts && Object.keys(formData.cohorts).map(e => Number(formData.cohorts[e])).reduce((p, c) => p + c) > 0) :
                    (formData.payType && Object.keys(formData.payType).map(e => Number(formData.payType[e])).reduce((p, c) => p + c) > 0)
            )
            &&
            formData.states.length > 0
        ) {
            setName(name.trim());
            return true;
        }
        return false;
    };


    const handleFormSubmit = async () => {
        if (!validateFormData(formData)) return;

        const req = requestObject();

        if (initialData.saveName || initialData.preferenceName) {
            req.preferenceId = initialData?.id;
            req.preferenceId = initialData?.preferenceId;
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
        setFormData({...initialData});
        dispatch(closeModal({ messageType: constants.MESSAGE_TYPES.CREATE_PREFERENCE, action: 'close' }));
    }

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
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
                            {formErrors?.name && <FormHelperText id="error-message">{formErrors?.name}</FormHelperText>}
                    </FormGroup>
                    <Filters
                        formData={formData}
                        onChangeFormData={setFormData}
                    />
                    <FormGroup className="form-group">
                        <FormControlLabel style={{ color: 'grey' }} control={<Checkbox checked={defaultVal} onChange={handleDefault} />} label="Make this as default" />
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
