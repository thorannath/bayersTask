import React from 'react'
import * as constants from '../../Constant';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import { FormControlLabel } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';

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
  const treatment = useSelector(state=> state.labels.treatments).map(data => {
    return { value: data.label_val, label: data.name }
  });;
  const medicalCondition = useSelector(state=> state.labels.medicalConditions).map(data => {
    return { value: data.label_val, label: data.name }
  });;
  const [formData, setFormData] = useState(props.formData);

  useEffect(() => {
    setFormData(props.formData);
  }, [props.formData]);

  const payerType = constants.Paytype;
  const patientCohort = constants.Patient_Cohort;

  const states = constants.States.map(data => {
    return { value: data, label: data }
  });

  const onChangeGroup = (event) => {
    let groupType = event.target.value;
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
        formVal.payType = {
          ...formVal.payType,
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

    }
    else if (logic === constants.Logic.OR) {
      formVal.treatmentsOR = treatment.filter(data=> treatments.includes(data.value)) ;

    }
    validateAndSend(formVal);
  }

  const onChangeMedicalCondition = (event, logic) =>{
    let medicalConditions = event.map(data=> data.value);
    let formVal = {...formData};
    if (logic === constants.Logic.AND) {
      formVal.medicalConditionsAND = medicalCondition.filter(data=> medicalConditions.includes(data.value));
    }
    else if (logic === constants.Logic.OR) {
      formVal.medicalConditionsOR = medicalCondition.filter(data=> medicalConditions.includes(data.value));
    }
    validateAndSend(formVal);
  }

  const validateAndSend = (formData) => {
      props.onChangeFormData(formData);
  };

  const GroupData = () => {
    if (formData.groupBy === constants.groupType.Cohort) {
      return (
        <FormGroup className="">
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

  {/* TODO: Create Form Validation for  complete form. Try to make a single function to handle form validations. Use examples of react form validations.*/}

  {/**TODO: https://adostes.medium.com/validating-a-form-in-react-cc29d47e140f */}

  return (
    <div className="filters">
      <FormGroup className="">
        <FormLabel component="legend">Group By</FormLabel>
        <RadioGroup row
          value={formData.groupBy}
          onClick={onChangeGroup}
          name="radio-buttons-group">
          <FormControlLabel value={constants.groupType.Cohort} control={<Radio />} label="Cohort" />
          <FormControlLabel value={constants.groupType.PayerType} control={<Radio />} label="Payer" />
        </RadioGroup>
      </FormGroup>

      <GroupData />

      <FormGroup className="">
        <FormLabel component="legend">States</FormLabel>
        <Select
          value={formData.states}
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
          value={formData.treatmentsAND}
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
          value={formData.treatmentsOR}
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
          value={formData.medicalConditionsAND}
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
          value={formData.medicalConditionsOR}
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