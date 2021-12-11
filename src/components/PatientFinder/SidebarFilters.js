import React, { useState, useEffect } from 'react'
import * as constants from '../../Constant';
import { useSelector } from 'react-redux';
import { invert } from 'lodash';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from 'react-select';
import FormGroup from '@mui/material/FormGroup';
import { FormControlLabel } from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import AccordianCheckbox from '../Inputs/AccordianCheckbox';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

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
        fontSize: 'small',
    }),
    control: (control) => ({
        ...control,
        fontSize: 'small'
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
    const payerType = constants.Paytype;
    const patientCohort = constants.Patient_Cohort;
    const states = invert(constants.States);

    const [treatmentLabels, setTreatmentLabels] = useState({});
    const [medicalConditionLabels, setMedicalConditionLabels] = useState({});
    const [formData, setFormData] = useState(props.formData);

    const treatments = useSelector(state => state.labels.treatments);
    const medicalConditions = useSelector(state => state.labels.medicalConditions);
    const preferences = useSelector(state => state.preferences.preferences.map(data => { return { value: data.id, label: data.saveName } }));
    const defaultPreferenceId = useSelector(state => state.preferences.defaultPreferenceId);
    const [defaultPreference, setDefaultPreference] = useState({ value: '', label: '' });

    useEffect(()=>{
        let object = {};
        treatments.map(val=> {
            object[val.label_val]= val.name;
        });
        setTreatmentLabels(object);
    }, [treatments]);

    useEffect(()=>{
        let object = {};
        medicalConditions.map(val=> {
            object[val.label_val]= val.name;
        });
        setMedicalConditionLabels(object);
    }, [medicalConditions]);


    useEffect(()=> {
        if(defaultPreferenceId){
            let preference = preferences.find((data)=> data.value === defaultPreferenceId);
            setDefaultPreference({ value: preference?.value ||'', label: preference?.label ||'' });
        }
        else{
            setDefaultPreference({ value: preferences[0]?.value || '', label: preferences[0]?.label || '' });
        }
    }, [defaultPreferenceId])

    useEffect(() => {
        if (props.formData.preferenceId) {
            setDefaultPreference({ value: props.formData.preferenceId, label: props.formData.preferenceName });
        }
        setFormData(props.formData);
    }, [props.formData]);


    const onChangePreference = (event) => {
        if (!event) return;
        setDefaultPreference(event);
        props.onChangePreference(event.value);
    };

    const onChangeGroup = (event) => {
        let groupType = event.target.value;
        props.onChangeFormData({groupBy: (groupType === constants.groupType.Cohort) ? constants.groupType.Cohort : constants.groupType.PayerType});

    }

    const onChangeGroupBy = (event, filterType) => {
        let formVal = { ...formData };
        switch (filterType) {
            case constants.groupType.Cohort:
                props.onChangeFormData({cohorts: { ...formVal.cohorts,
                    [event.target.name]: event.target.checked,}})
                break;

            case constants.groupType.PayerType:
                props.onChangeFormData({payType: { ...formVal.payType,
                    [event.target.name]: event.target.checked,}})
                break;
        }
    }

    const GroupData = () => {
        if (formData.groupBy === constants.groupType.Cohort) {
            return (
                <FormGroup className="formGroup">
                    <FormLabel className="formLabel">Cohort Type</FormLabel>
                    <div row='true'>
                        {patientCohort.map((data, i) => {
                            return <FormControlLabel key={`cohort-formgrp-${i}`}
                                control={
                                    <Checkbox
                                        checked={formData.cohorts[data]}
                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                                        onChange={(e) => onChangeGroupBy(e, constants.groupType.Cohort)}
                                        name={data} />
                                }
                                label={<Typography variant="body2" color="textSecondary">{data.toUpperCase()}</Typography>} />
                        })}
                    </div>
                </FormGroup>
            )
        }
        else if (formData.groupBy === constants.groupType.PayerType) {
            return (
                <FormGroup className="formGroup" >
                    <FormLabel className="formLabel">Payer Type</FormLabel>
                    <div row='true'>
                        {payerType.map((data, i) => {
                            return <FormControlLabel key={`paytyp-formgrp-${i}`}
                                control={
                                    <Checkbox checked={formData.payType[data]}
                                        onChange={(e) => onChangeGroupBy(e, constants.groupType.PayerType)}
                                        name={data} />
                                }
                                label={<Typography variant="body2" color="textSecondary">{data.toUpperCase()}</Typography>} />
                        })}
                    </div>
                </FormGroup>
            )
        }
        else {
            return null
        }
    }

    const onChangeStates = (data) => {
        props.onChangeFormData({states: data});
    }

    const onChangeTreatmentsAND = (data)=> {
        props.onChangeGraphData({treatmentsAND: data});
    }

    const onChangeTreatmentsOR = (data)=> {
        props.onChangeGraphData({treatmentsOR: data});
    }

    const onChangeMedicalConditionsAND = (data)=> {
        props.onChangeGraphData({medicalConditionsAND: data});
    }

    const onChangeMedicalConditionsOR = (data)=> {
        props.onChangeGraphData({medicalConditionsOR: data});
    }

    return (
        <div className="sidebar">
            <div className="sidebar-content">
                <h3> Patient Finder Definition</h3>

                <FormGroup className="formGroup">
                    <FormLabel className="formLabel">Preferences <InfoOutlinedIcon fontSize="small" color="primary" /></FormLabel>
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
                    <FormLabel className="formLabel">Group By <InfoOutlinedIcon fontSize="small" color="primary" /></FormLabel>
                    <RadioGroup row
                        value={formData.groupBy}
                        onClick={onChangeGroup}
                        name="radio-buttons-group">
                        <FormControlLabel value={constants.groupType.Cohort} control={<Radio />}
                            label={<Typography variant="body2" color="textSecondary">Cohort</Typography>} />
                        <FormControlLabel value={constants.groupType.PayerType} control={<Radio />}
                            label={<Typography variant="body2" color="textSecondary">Payer</Typography>} />
                    </RadioGroup>
                </FormGroup>

                <GroupData />

                <AccordianCheckbox name="States" data={props.formData.states} labels={states} onChange={onChangeStates} />
                <AccordianCheckbox name="Treatments with AND" data={props.formData.treatmentsAND} labels={treatmentLabels} onChange={onChangeTreatmentsAND} />
                <AccordianCheckbox name="Treatments with OR" data={props.formData.treatmentsOR} labels={treatmentLabels} onChange={onChangeTreatmentsOR} />
                <AccordianCheckbox name="Medical Conditions with AND" data={props.formData.medicalConditionsAND} labels={medicalConditionLabels} onChange={onChangeMedicalConditionsAND} />
                <AccordianCheckbox name="Medical Conditions with OR" data={props.formData.medicalConditionsOR} labels={medicalConditionLabels} onChange={onChangeMedicalConditionsOR} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '30px', marginTop: '20px', marginBottom: '20px' }}>
                    <Button color="primary" variant="contained" type="submit" onClick={props.onUpdateChart}> Update </Button>
                    <Button color="warning" variant="outlined" onClick={props.onResetChart}> Reset </Button>
                </div>
        </div>
    )
}

export default React.memo(SidebarFilters)
