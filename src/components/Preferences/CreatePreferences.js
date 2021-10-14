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


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    overflowY: 'scroll',
    width: '50%',
    height: '100%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted pink',
      color: state.isSelected ? 'red' : 'blue',
      padding: 20,
    }),
    control: () => ({
      // none of react-select's styles are passed to <Control />
      backgroundColor:'red',
      width: '100%',
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
  
      return { ...provided, opacity, transition };
    }
  }


//get /preferences?username=value

const CreatePreferences = (props) => {

    const patientCohort = constants.Patient_Cohort;
    const [cohort, setCohort] = useState({ ckd: true, diab: true, both: true });
    const [payType, setPayType] = useState({ MCR: true, COM: true })
    const [groupBy, setGroupBy] = useState(constants.groupType.Cohort);

    const payerType = constants.Paytype;
    const states = constants.States.map(data => {
        return { value: data, label: data }
    });

    const treatment = props.treatment.map(data => {
        return { value: data.label_val, label: data.name }
    });

    const medicalCondition = props.medicalCondition.map(data => {
        return { value: data.label_val, label: data.name }
    });;

    const [filtersStates, setFilterStates] = useState([]);
    const [filterTreatmentAND, setFilterTreatmentAND] = useState([]);
    const [filterMedicalConditionAND, setFilterMedicalConditionAND] = useState([]);
    const [filterTreatmentOR, setFilterTreatmentOR] = useState([]);
    const [filterMedicalConditionOR, setFilterMedicalConditionOR] = useState([]);

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
        if (logic === constants.Logic.AND) {
            let treatments = filterTreatmentAND;
            if (event.target.checked) {
                treatments.push(event.target.value)
            }
            else {
                treatments = treatments.filter(data => data != event.target.value);
            }
            setFilterTreatmentAND([...treatments]);
        }
        else if (logic === constants.Logic.OR) {
            let treatments = filterTreatmentOR;
            if (event.target.checked) {
                treatments.push(event.target.value)
            }
            else {
                treatments = treatments.filter(data => data != event.target.value);
            }
            setFilterTreatmentOR([...treatments]);
        }
    }

    const handleMedicalCondition = (event, logic) => {
        if (logic === constants.Logic.AND) {
            let medicalConditions = filterMedicalConditionAND;
            if (event.target.checked) {
                medicalConditions.push(event.target.value)
            }
            else {
                medicalConditions = medicalConditions.filter(data => data != event.target.value);
            }
            setFilterMedicalConditionAND([...medicalConditions]);
        }
        else if (logic === constants.Logic.OR) {
            let medicalConditions = filterMedicalConditionOR;
            if (event.target.checked) {
                medicalConditions.push(event.target.value)
            }
            else {
                medicalConditions = medicalConditions.filter(data => data != event.target.value);
            }
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
                                        onChange={(e)=>handleGroupBy(e, 'cohort')}
                                        name={data} />
                                }
                                label={data.toUpperCase()}
                            />
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
                                    onChange={(e)=>handleGroupBy(e, 'cohort')}
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

    const handleFormSubmit = () => {

    }

    return (
        <div>
            <Box sx={style}>
                <h2> Create a Preference </h2>
                <FormGroup className="form-group">
                    <TextField id="standard-basic" label="Preference Name" variant="standard" />
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
                        onChange={(e) => handleMedicalCondition(e, constants.Logic.AND)}
                        classNamePrefix="select"
                    />
                </FormGroup>
                <br/>
                <FormGroup className="form-group">
                    <FormControlLabel control={<Checkbox />} label="Make this as default" />
                </FormGroup>
                <div align="right">
                    <Button type="submit" sx={{ width: '25%' }} variant="contained" onClick={handleFormSubmit}>Save</Button>
                    <Button type="submit" sx={{ width: '25%' }} color="warning">Cancel</Button>
                </div>
            </Box>
        </div>
    )
}

export default CreatePreferences
