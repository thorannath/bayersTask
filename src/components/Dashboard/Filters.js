import React from 'react'
import * as constants from '../../Constant';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import { FormControlLabel } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from 'react-select';
import { useEffect, useState, useCallback } from 'react';

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

export const Filters = (props) => {

  const [formData, setFormData] = useState(props.formData);

  console.log(formData);
  const [treatmentsAND, setTreatmentsAND] = useState(formData.treatmentsAND);
  const [treatmentsOR, setTreatmentsOR] = useState(formData.treatmentsOR);
  const [medicalConditionsAND, setMedicalConditionsAND] = useState(formData.medicalConditionsAND);
  const [medicalConditionsOR, setMedicalConditionsOR] = useState(formData.medicalConditionsOR);


  useEffect(() => {
    setFormData(props.formData)
  }, [props.formData]);

  const payerType = constants.Paytype;
  const patientCohort = constants.Patient_Cohort;

  const states = constants.States.map(data => {
    return { value: data, label: data }
  });

  const treatment = props.treatment.map(data => {
    return { value: data.label_val, label: data.name }
  });

  const medicalCondition = props.medicalCondition.map(data => {
    return { value: data.label_val, label: data.name }
  });

  const onChangeGroup = (groupType) => {
    let formVal = {...formData};
    formVal.groupBy = (groupType === constants.groupType.Cohort) ? constants.groupType.Cohort : constants.groupType.PayerType;
    validateAndSend(formVal);

  }

  const onChangeGroupBy = (event, filterType) => {
    let formVal = {...formData};
    switch (filterType) {
      case constants.groupType.Cohort:
        formVal.cohorts = {
          ...formVal.cohorts,
          [event.target.name]: event.target.checked,
        }
        break;

      case constants.groupType.PayerType:
        formVal.payerType = {
          ...formVal.payerType,
          [event.target.name]: event.target.checked,
        };
        break;
    }
    validateAndSend(formVal);
  }

  const onChangeStates = (event) => {
    let formVal = {...formData};
    let statesData = event.map((data) => data.value);
    formVal.states = states.filter(data=> statesData.includes(data.value)) 
    validateAndSend(formVal);
  }

  const onChangeTreatment = (event, logic) =>{
    let treatments = event.map(data=> data.value);
    let formVal = {...formData};
    if (logic === constants.Logic.AND) {
      formVal.treatmentsAND =  treatment.filter(data=> treatments.includes(data.value));
      setTreatmentsAND(formVal.treatmentsAND);

    }
    else if (logic === constants.Logic.OR) {
      formVal.treatmentsOR = treatment.filter(data=> treatments.includes(data.value)) ;
      setTreatmentsOR(formVal.treatmentsOR);

    }
    validateAndSend(formVal);

  }

  const onChangeMedicalCondition = (event, logic) =>{
    let medicalConditions = event.map(data=> data.value);
    let formVal = {...formData};
    if (logic === constants.Logic.AND) {
      formVal.medicalConditionsAND = medicalCondition.filter(data=> medicalConditions.includes(data.value));
      setMedicalConditionsAND(formVal.medicalConditionsAND);
    }
    else if (logic === constants.Logic.OR) {
      formVal.medicalConditionsOR = medicalCondition.filter(data=> medicalConditions.includes(data.value));
      setMedicalConditionsOR(formVal.medicalConditionsOR);
    }
    validateAndSend(formVal);
  }

  const validateFormData = (formData) =>{
    if(formData.groupBy && formData.treatmentsAND.length!=0 && formData.treatmentsOR.length!=0 && formData.medicalConditionsAND.length!=0 && formData.medicalConditionsOR.length!=0){
      return true;
    }
    return false;
  };

  const validateAndSend = (formData) => {
    setFormData({...formData});
    if(validateFormData(formData)){
      props.onChangeFormData(formData);
    }
  };

  const GroupData = () => {
    if (props.formData.groupBy == constants.groupType.Cohort) {
      return (
        <FormGroup className="">
          <FormLabel component="legend">Cohort Type</FormLabel>
          <div row>
            {patientCohort.map((data, i) => {
              return <FormControlLabel key={`cohort-formgrp-${i}`}
                control={
                  <Checkbox
                    checked={props.formData.cohorts[data]}
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
    else if (formData.groupBy == constants.groupType.PayerType) {
      return (
        <FormGroup className="" >
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
    else{
      return null
    }
  }

  return (
    <div className="filters">
      <FormGroup className="">
        <FormLabel component="legend">Group By</FormLabel>
        <RadioGroup row
          defaultValue={formData.groupBy}
          onClick={(e) => onChangeGroup(e.target.value)}
          name="radio-buttons-group">
          <FormControlLabel value={constants.groupType.Cohort} control={<Radio />} label="Cohort" />
          <FormControlLabel value={constants.groupType.PayerType} control={<Radio />} label="Payer" />
        </RadioGroup>
      </FormGroup>

      <GroupData />

      <FormGroup className="">
        <FormLabel component="legend">States</FormLabel>
        <Select
          defaultValue={formData.states}
          isMulti
          name="states"
          styles={customStyles}
          options={states}
          key="value"
          label="label"
          onChange={(e) => onChangeStates(e)}
          classNamePrefix="select" />
      </FormGroup>
      <br />
      <FormGroup className="">
        <FormLabel component="legend">Treatment with AND</FormLabel>
        <Select
          isMulti
          name="treatmentAND"
          value={treatmentsAND}
          styles={customStyles}
          options={treatment}
          onChange={(e) => onChangeTreatment(e, constants.Logic.AND)}
          classNamePrefix="select"
        />
      </FormGroup>
      <br />
      <FormGroup className="">
        <FormLabel component="legend">Treatment with OR</FormLabel>
        <Select
          isMulti
          name="treatmentOR"
          value={treatmentsOR}
          styles={customStyles}
          options={treatment}
          onChange={(e) => onChangeTreatment(e, constants.Logic.OR)}
          classNamePrefix="select"
        />
      </FormGroup>
      <br />
      <FormGroup className="">
        <FormLabel component="legend">Medical Conditions with AND</FormLabel>
        <Select
          isMulti
          name="colors"
          value={medicalConditionsAND}
          styles={customStyles}
          options={medicalCondition}
          onChange={(e) => onChangeMedicalCondition(e, constants.Logic.AND)}
          classNamePrefix="select"
        />
      </FormGroup>
      <br />
      <FormGroup className="">
        <FormLabel component="legend">Medical Condtions with OR</FormLabel>
        <Select
          isMulti
          name="colors"
          value={medicalConditionsOR}
          styles={customStyles}
          options={medicalCondition}
          onChange={(e) => onChangeMedicalCondition(e, constants.Logic.OR)}
          classNamePrefix="select"
        />
      </FormGroup>
    </div>
  )
}

export default Filters