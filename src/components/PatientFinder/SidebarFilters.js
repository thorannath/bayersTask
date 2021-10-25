import React from 'react'
import * as constants from '../../Constant';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Select from 'react-select';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { FormControlLabel } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Checkbox from '@mui/material/Checkbox';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BookmarksIcon from '@mui/icons-material/Bookmarks';

const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid grey',
        color: state.selectProps.menuColor,
        width: '50%',
    }),
    option: (provided, state) => ({
        ...provided,
        padding: 20,
    }),
    control: (control) => ({
        ...control,
        padding: 4
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
        setFormData(props.formData);
    }, [props.formData]);

    const [formData, setFormData] = useState(props.formData);
    const preferences = useSelector(state => state.preferences.preferences.map(data => { return { value: data.id, label: data.saveName } }));
    const defaultPreferenceId = useSelector(state => state.preferences.defaultPreferenceId);

    console.log(defaultPreferenceId);
    const [defaultPreference, setDefaultPreference] = useState({value:'', label:''});

    useEffect(() => {
        if (defaultPreference.value !== defaultPreferenceId) {
            let preference = preferences.find(data=> data.value == defaultPreferenceId);
            onChangePreference(preference);
        }
        else {
            console.log(preferences);
        }

    }, [defaultPreferenceId]);

    const payerType = constants.Paytype;
    const patientCohort = constants.Patient_Cohort;

    const states = constants.States.map(data => {
        return { value: data, label: data }
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
                    <FormLabel component="legend">Cohort Type</FormLabel>
                    <div row>
                        {patientCohort.map((data, i) => {
                            return <FormControlLabel key={`cohort-formgrp-${i}`}
                                control={
                                    <Checkbox
                                        checked={formData.cohorts[data]}
                                        onChange={(e) => onChangeGroupBy(e, constants.groupType.Cohort)}
                                        name={data} />
                                }
                                label={data.toUpperCase()}
                            />
                        })}
                    </div>
                </FormGroup>
            )
        }
        else if (formData.groupBy === constants.groupType.PayerType) {
            return (
                <FormGroup className="formGroup" >
                    <FormLabel component="legend">Payer Type</FormLabel>
                    <div row>
                        {payerType.map((data, i) => {
                            return <FormControlLabel key={`paytyp-formgrp-${i}`}
                                control={
                                    <Checkbox checked={formData.payType[data]}
                                        onChange={(e) => onChangeGroupBy(e, constants.groupType.PayerType)}
                                        name={data} />
                                }
                                label={data} />
                        })}
                    </div>
                </FormGroup>
            )
        }
        else {
            return null
        }
    }

    return (
        <div className="sidebar">
            <h3> Patient Finder Definition</h3>
            <FormGroup className="formGroup">
                <FormLabel>Preferences <InfoOutlinedIcon fontSize="small" color="primary" /></FormLabel>
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
                <FormLabel>Group By <InfoOutlinedIcon fontSize="small" color="primary" /></FormLabel>
                <RadioGroup
                    value={formData.groupBy}
                    onClick={onChangeGroup}
                    name="radio-buttons-group">
                    <FormControlLabel value={constants.groupType.Cohort} control={<Radio />} label="Cohort" />
                    <FormControlLabel value={constants.groupType.PayerType} control={<Radio />} label="Payer" />
                </RadioGroup>
            </FormGroup>

            <GroupData />

            <FormGroup className="formGroup">
                <FormLabel>States <InfoOutlinedIcon fontSize="small" color="primary" /></FormLabel>
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


        </div>
    )
}

export default SidebarFilters
