import React from 'react'
import * as constants from '../../Constant';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Select from 'react-select';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { FormControlLabel } from '@mui/material';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid grey',
        color: state.selectProps.menuColor,
        width: '50%',
    }),
    option: (provided, state) => ({
        ...provided,
        padding: 8,
        fontSize:'small',
    }),
    control: (control) => ({
        ...control,
        fontSize:'small'
    }),
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';
        return { ...provided, opacity, transition };
    },
    multiValue: (styles, { data }) => {
        return {
            ...styles,
            backgroundColor: '#ffae42',
            color: 'whitesmoke',
        };
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: data.color,
    }),
    multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: data.color,
        ':hover': {
            backgroundColor: data.color,
            color: 'white',
        },
    }),
}


const SidebarFilters = (props) => {

    useEffect(() => {
        if(props.formData.preferenceId){
           setDefaultPreference({value:props.formData.preferenceId, label:props.formData.preferenceName});
        }
        setFormData(props.formData);
    }, [props.formData]);

    const [formData, setFormData] = useState(props.formData);
    const preferences = useSelector(state => state.preferences.preferences.map(data => { return { value: data.id, label: data.saveName } }));
    const defaultPreferenceId = useSelector(state => state.preferences.defaultPreferenceId);

    const treatment = useSelector(state => state.labels.treatments).map(data => {
        return { value: data.label_val, label: data.name }
    });
    const medicalCondition = useSelector(state => state.labels.medicalConditions).map(data => {
        return { value: data.label_val, label: data.name }
    });

    const [defaultPreference, setDefaultPreference] = useState({ value: '', label: '' });

    useEffect(() => {
        if (defaultPreference.value !== defaultPreferenceId) {
            let preference = preferences.find(data => data.value == defaultPreferenceId);
            onChangePreference(preference);
        }
        else {
            console.log(preferences);
        }

    }, [defaultPreferenceId]);

    const payerType = constants.Paytype;
    const patientCohort = constants.Patient_Cohort;

    const states = Object.keys(constants.States).map(key => {
        return { value: constants.States[key], label: key}
    });

    const validateAndSend = (formData) => {
        props.onChangeFormData(formData);
    };

    const onChangeStates = (event) => {
        let formVal = { ...formData };
        let statesData = event.map((data) => data.value);
        formVal.states = states.filter(data => statesData.includes(data.value))
        validateAndSend(formVal);
    }

    const onChangePreference = (event) => {
        if(!event) return;
        setDefaultPreference(event);
        props.onChangePreference(event.value);
    };

    const onChangeGroup = (event) => {
        let groupType = event.target.value;
        let formVal = { ...formData };
        formVal.groupBy = (groupType === constants.groupType.Cohort) ? constants.groupType.Cohort : constants.groupType.PayerType;
        validateAndSend(formVal);
    }

    const onChangeGroupBy = (event, filterType) => {
        let formVal = { ...formData };
        switch (filterType) {
            case constants.groupType.Cohort:
                formVal.cohorts = {
                    ...formVal.cohorts,
                    [event.target.name]: event.target.checked,
                }
                break;

            case constants.groupType.PayerType:
                formVal.payType = {
                    ...formVal.payType,
                    [event.target.name]: event.target.checked,
                };
                break;
        }
        validateAndSend(formVal);
    }

    const GroupData = () => {
        if (formData.groupBy === constants.groupType.Cohort) {
            return (
                <FormGroup className="formGroup">
                    <FormLabel class="formLabel">Cohort Type</FormLabel>
                    <div row>
                        {patientCohort.map((data, i) => {
                            return <FormControlLabel key={`cohort-formgrp-${i}`}
                                control={
                                    <Checkbox
                                        checked={formData.cohorts[data]}
                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                                        onChange={(e) => onChangeGroupBy(e, constants.groupType.Cohort)}
                                        name={data} />
                                }
                                label={<Typography variant="body2" color="textSecondary">{data.toUpperCase()}</Typography>}/>
                        })}
                    </div>
                </FormGroup>
            )
        }
        else if (formData.groupBy === constants.groupType.PayerType) {
            return (
                <FormGroup className="formGroup" >
                    <FormLabel class="formLabel">Payer Type</FormLabel>
                    <div row>
                        {payerType.map((data, i) => {
                            return <FormControlLabel key={`paytyp-formgrp-${i}`}
                                control={
                                    <Checkbox checked={formData.payType[data]}
                                        onChange={(e) => onChangeGroupBy(e, constants.groupType.PayerType)}
                                        name={data} />
                                }
                                label={<Typography variant="body2" color="textSecondary">{data.toUpperCase()}</Typography>}/>
                        })}
                    </div>
                </FormGroup>
            )
        }
        else {
            return null
        }
    }

    const onChangeTreatment = (event, logic) => {
        let treatments = event.map(data => data.value);
        let formVal = { ...formData };
        if (logic === constants.Logic.AND) {
            formVal.treatmentsAND = treatment.filter(data => treatments.includes(data.value));

        }
        else if (logic === constants.Logic.OR) {
            formVal.treatmentsOR = treatment.filter(data => treatments.includes(data.value));

        }
        setFormData({ ...formVal });
    }

    const onChangeMedicalCondition = (event, logic) => {
        let medicalConditions = event.map(data => data.value);
        let formVal = { ...formData };
        if (logic === constants.Logic.AND) {
            formVal.medicalConditionsAND = medicalCondition.filter(data => medicalConditions.includes(data.value));
        }
        else if (logic === constants.Logic.OR) {
            formVal.medicalConditionsOR = medicalCondition.filter(data => medicalConditions.includes(data.value));
        }
        setFormData({ ...formVal });
    }

    return (
        <div className="sidebar">
            <div className="sidebar-content">
            <div id="sidebar-message" style={{visibility: "hidden"}}>
                <p>Message</p>
            </div>
            <h3> Patient Finder Definition</h3>
            <FormGroup className="formGroup">
                <FormLabel class="formLabel">Preferences <InfoOutlinedIcon fontSize="small" color="primary" /></FormLabel>
                <Select
                    name="preferences"
                    value={defaultPreference}
                    styles={customStyles}
                    options={preferences}
                    key="value"
                    label="label"
                    onChange={(e) => onChangePreference(e)}
                    classNamePrefix="select" />
            </FormGroup>
            <FormGroup className="formGroup">
                <FormLabel class="formLabel">Group By <InfoOutlinedIcon fontSize="small" color="primary" /></FormLabel>
                <RadioGroup row
                    value={formData.groupBy}
                    onClick={onChangeGroup}
                    name="radio-buttons-group">
                    <FormControlLabel value={constants.groupType.Cohort} control={<Radio />} 
                        label={<Typography variant="body2" color="textSecondary">Cohort</Typography>}/>
                    <FormControlLabel value={constants.groupType.PayerType} control={<Radio />}
                      label={<Typography variant="body2" color="textSecondary">Payer</Typography>}/>
                </RadioGroup>
            </FormGroup>

            <GroupData />

            <FormGroup className="formGroup">
                <FormLabel class="formLabel">States <InfoOutlinedIcon fontSize="small" color="primary" /></FormLabel>
                <Select
                    isMulti
                    name="states"
                    value={formData.states}
                    styles={customStyles}
                    options={states}
                    key="value"
                    label="label"
                    onChange={(e) => onChangeStates(e)}
                    classNamePrefix="select" />
            </FormGroup>

            <FormGroup className="formGroup">
                <FormLabel class="formLabel">Treatment with AND</FormLabel>
                <Select
                    isMulti
                    name="treatmentAND"
                    value={formData.treatmentsAND}
                    styles={customStyles}
                    options={treatment}
                    onChange={(e) => onChangeTreatment(e, constants.Logic.AND)}
                    classNamePrefix="select"
                />
            </FormGroup>
            <FormGroup className="formGroup">
                <FormLabel class="formLabel">Treatment with OR</FormLabel>
                <Select
                    isMulti
                    name="treatmentOR"
                    value={formData.treatmentsOR}
                    styles={customStyles}
                    options={treatment}
                    onChange={(e) => onChangeTreatment(e, constants.Logic.OR)}
                    classNamePrefix="select"
                />
            </FormGroup>

            <FormGroup className="formGroup">
                <FormLabel class="formLabel">Medical Conditions with AND</FormLabel>
                <Select
                    isMulti
                    name="colors"
                    value={formData.medicalConditionsAND}
                    styles={customStyles}
                    options={medicalCondition}
                    onChange={(e) => onChangeMedicalCondition(e, constants.Logic.AND)}
                    classNamePrefix="select"
                />
            </FormGroup>
            <FormGroup className="formGroup">
                <FormLabel class="formLabel">Medical Condtions with OR</FormLabel>
                <Select
                    isMulti
                    name="colors"
                    value={formData.medicalConditionsOR}
                    styles={customStyles}
                    options={medicalCondition}
                    onChange={(e) => onChangeMedicalCondition(e, constants.Logic.OR)}
                    classNamePrefix="select"
                />
            </FormGroup>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '30px', marginTop: '20px', marginBottom: '20px' }}>
                <Button color="primary" variant="contained" type="submit" onClick={props.onUpdateChart}> Update </Button>
                <Button color="warning" variant="outlined" onClick={props.onResetChart}> Reset </Button>
            </div>
            <Button color="info" fullWidth variant="contained" onClick={props.onTakeScreenshot}> Take Screenshot </Button>

            </div>
        </div>
    )
}

export default SidebarFilters
