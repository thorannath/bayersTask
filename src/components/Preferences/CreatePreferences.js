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

    const patientCohort = constants.Patient_Cohort;
    const [cohort, setCohort] = useState({ ckd: true, diab: true, both: true });
    const [payType, setPayType] = useState({ MCR: true, COM: true })
    const [groupBy, setGroupBy] = useState(constants.groupType.Cohort);
    const [name, setName] = useState('');

    const payerType = constants.Paytype;
    const states = constants.States.map(data => {
        return { value: data, label: data }
    });

    const treatment = props.treatment.map(data => {
        return { value: data.label_val, label: data.name }
    });

    const medicalCondition = props.medicalCondition.map(data => {
        return { value: data.label_val, label: data.name }
    });

    const [filtersStates, setFilterStates] = useState([]);
    const [filterTreatmentAND, setFilterTreatmentAND] = useState([]);
    const [filterMedicalConditionAND, setFilterMedicalConditionAND] = useState([]);
    const [filterTreatmentOR, setFilterTreatmentOR] = useState([]);
    const [filterMedicalConditionOR, setFilterMedicalConditionOR] = useState([]);

    const handleName = (event)=>{
        setName(event.target.value);
    }
    const handleStates = (event) => {
        let states = event.map((data) => data.value);
        setFilterStates([...states]);
    };

    const handleGroupBy = (event, filterType) =>{
        switch (filterType) {
            case constants.groupType.Cohort:
                setCohort({
                    ...cohort,
                    [event.target.name]: event.target.checked,
                });
                break;

            case constants.groupType.PayerType:
                setPayType({
                    ...payType,
                    [event.target.name]: event.target.checked,
                });
                break;
        }
    }


    const handleGroup = (group) => {
        if (group == constants.groupType.Cohort) {
            setGroupBy(constants.groupType.Cohort);
        }
        else if (group == constants.groupType.PayerType) {
            setGroupBy(constants.groupType.PayerType);
        }
    };

    const handleTreatment = (event, logic) =>{
        let treatments = event.map(data=> data.value);
        if (logic === constants.Logic.AND) {
            setFilterTreatmentAND(treatments);

        }
        else if (logic === constants.Logic.OR) {
            setFilterTreatmentOR([...treatments]);
        }
    }

    const handleMedicalCondition = (event, logic) => {
        let medicalConditions = event.map(data=> data.value);
        if (logic === constants.Logic.AND) {
            setFilterMedicalConditionAND([...medicalConditions]);
        }
        else if (logic === constants.Logic.OR) {
            setFilterMedicalConditionOR([...medicalConditions]);
        }
    };

    const GroupData = () => {
        if (groupBy == constants.groupType.Cohort) {
            return (
                <FormGroup className="form-group">
                    <FormLabel component="legend">Cohort Type</FormLabel>
                    <div row>
                        {patientCohort.map((data, i) => {
                            return <FormControlLabel key={`cohort-formgrp-${i}`}
                                control={
                                    <Checkbox
                                        checked={cohort[data]}
                                        onChange={(e)=>handleGroupBy(e, constants.groupType.Cohort)}
                                        name={data} />
                                }
                                label={data.toUpperCase()}/>
                        })}
                    </div>
                </FormGroup>
            )
        }
        else if (groupBy == constants.groupType.PayerType) {
            return (
                <FormGroup className="form-group" >
                    <FormLabel component="legend">Payer Type</FormLabel>
                    <div row>
                        {payerType.map((data, i) => {
                            return <FormControlLabel key={`paytyp-formgrp-${i}`}
                                control={
                                    <Checkbox checked={payType[data]}
                                    onChange={(e)=>handleGroupBy(e, constants.groupType.PayerType)}
                                    name={data} />
                                }
                                label={data}
                            />
                        })}
                    </div>
                </FormGroup>
            )
        }
    }

    const handleDefault = (event) =>{
        console.log(event.target.checked)

    }

    const requestObject = () => {
        console.log(name, 'name');
        console.log(filtersStates, 'filterStates');
        console.log(cohort, 'cohort');
        console.log(payerType, 'payerType');
        console.log(groupBy, 'groupBy');
        console.log(filterTreatmentAND,'filterTreatmentAND');
        console.log(filterTreatmentOR, 'filterTreatmentOR');
        console.log(filterMedicalConditionAND, 'filterMedicalConditionAND');
        console.log(filterMedicalConditionOR,'filterMedicalConditionOR');
    }
    

    const handleFormSubmit = () => {
        requestObject();
        props.closeModal({type:'create', action:'add', success:true, message:'Preference added sucessfully' });
    }

    const handleCancel = ()=>{
        props.closeModal({type:'create', action:'add'});
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
                <FormGroup classsName="form-group">
                    <FormLabel component="legend">Group By</FormLabel>
                    <RadioGroup row
                        defaultValue="cohort"
                        onClick={(e) => handleGroup(e.target.value)}
                        name="radio-buttons-group">
                        <FormControlLabel value="cohort" control={<Radio />} label="Cohort" />
                        <FormControlLabel value="paytype" control={<Radio />} label="Payer" />
                    </RadioGroup>
                </FormGroup>
                <GroupData />
                <FormGroup classsName="form-group">
                    <FormLabel component="legend">States</FormLabel>
                    <Select
                        isMulti
                        name="colors"
                        styles={customStyles}
                        options={states}
                        onChange={handleStates}
                        classNamePrefix="select"
                    />
                </FormGroup>
                <br/>
                <FormGroup classsName="form-group">
                    <FormLabel component="legend">Treatment with AND</FormLabel>
                    <Select
                        isMulti
                        name="colors"
                        styles={customStyles}
                        options={treatment}
                        onChange={(e) => handleTreatment(e,constants.Logic.AND)}
                        classNamePrefix="select"
                    />
                </FormGroup>
                <br/>
                <FormGroup classsName="form-group">
                    <FormLabel component="legend">Treatment with OR</FormLabel>
                    <Select
                        isMulti
                        name="colors"
                        styles={customStyles}
                        options={treatment}
                        onChange={(e) => handleTreatment(e,constants.Logic.OR)}
                        classNamePrefix="select"
                    />
                </FormGroup>
                <br/>
                <FormGroup classsName="form-group">
                    <FormLabel component="legend">Medical Conditions with AND</FormLabel>
                    <Select
                        isMulti
                        name="colors"
                        styles={customStyles}
                        options={medicalCondition}
                        onChange={(e) => handleMedicalCondition(e, constants.Logic.AND)}
                        classNamePrefix="select"
                    />
                </FormGroup>
                <br/>
                <FormGroup classsName="form-group">
                    <FormLabel component="legend">Medical Condtions with OR</FormLabel>
                    <Select
                        isMulti
                        name="colors"
                        styles={customStyles}
                        options={medicalCondition}
                        onChange={(e) => handleMedicalCondition(e, constants.Logic.OR)}
                        classNamePrefix="select"
                    />
                </FormGroup>
                <FormGroup className="form-group">
                    <FormControlLabel control={<Checkbox onChange={handleDefault}/>} label="Make this as default" />
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
