import React from 'react'
import Box from '@mui/material/Box'
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { Button, TextField } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Select from 'react-select';
import './Preferences.css';
import * as constants from '../../Constant';
import { useState, useEffect } from 'react';
import axios from 'axios'

import CloseIcon from '@mui/icons-material/Close';
import Filters from '../Dashboard/Filters';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    overflowY: 'scroll',
    width: '50%',
    height: '90%',
    borderRadius:2,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
};

const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        width: state.selectProps.width,
        borderBottom: '1px solid grey',
        color: state.selectProps.menuColor,
        width:'50%',
      }),
    option: (provided, state) => ({
      ...provided,
      padding: 20,
    }),
    control: (control)=>({
        ...control,
        padding:4
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
          color:'whitesmoke',
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

//get /preferences?username=value

const CreatePreferences = (props) => {

    const states = constants.States;
    
    const initialData = {
        preferenceName: null,
        groupBy: constants.groupType.Cohort,
        states,
        cohorts: { ckd: true, diab: true, both: true },
        payType: { MCR: true, COM: true },
        treatmentsOR: null,
        treatmentsAND: null,
        medicalConditionsAND: null,
        medicalConditionsOR: null,
        default:false,
    }

    const [name, setName] = useState(initialData.preferenceName);
    const [defaultVal, setDefaultVal] = useState(initialData.default);

    const [formData, setFormData] = useState({...initialData});

    const treatment = props.treatment.map(data => {
        return { value: data.label_val, label: data.name }
    });

    const medicalCondition = props.medicalCondition.map(data => {
        return { value: data.label_val, label: data.name }
    });

    const handleName = (event)=>{
        setName(event);
    }

    const handleDefault = (event) =>{
        setDefaultVal(event.target.checked);
    }

    const requestObject = () => {
        // console.log(name, 'name');
        // console.log(filtersStates, 'filterStates');
        // console.log(cohort, 'cohort');
        // console.log(payerType, 'payerType');
        // console.log(groupBy, 'groupBy');
        // console.log(filterTreatmentAND,'filterTreatmentAND');
        // console.log(filterTreatmentOR, 'filterTreatmentOR');
        // console.log(filterMedicalConditionAND, 'filterMedicalConditionAND');
        // console.log(filterMedicalConditionOR,'filterMedicalConditionOR');
    }
    
    const handleFormSubmit = () => {
        formData.default = defaultVal;
        formData.preferenceName = name;
        requestObject();
        console.log(formData, 'Create Preference');
        props.closeModal({type:'create', action:'add', success:true, message:'Preference added sucessfully' });
    }

    const handleCancel = ()=>{
        props.closeModal({type:'create', action:'close'});
    }

    const handleFormData = (data)=>{
        setFormData({...data});
    }

    return (
        <div>
            <Box sx={style}>
            <div align="right">
                <Button type="submit" onClick={handleCancel}><CloseIcon /></Button>
            </div>
                <h2> Create a Preference </h2>
                <FormGroup className="form-group">
                    <TextField 
                    id="standard-basic" 
                    label="Preference Name" 
                    onChange={handleName}
                    variant="standard" />
                </FormGroup>
                <Filters
                formData={initialData}
                onChangeFormData= {handleFormData}
                treatment={treatment}
                medicalCondition={medicalCondition}
                />
                <FormGroup className="form-group">
                    <FormControlLabel control={<Checkbox checked={formData.default} onChange={handleDefault}/>} label="Make this as default" />
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
