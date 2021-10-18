import React from 'react'
import * as constants from '../../Constant';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import { FormControlLabel } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from 'react-select';
import { useEffect } from 'react';

const customStyles = {
  menu: (provided, state) => ({
    ...provided,
    width: state.selectProps.width,
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

  const formData = props.formData;
  const payerType = constants.Paytype;
  const patientCohort = constants.Patient_Cohort;

  const defaultStates = formData.states;
  const defaultTreatmentsOR = formData.treatmentsOR;
  const defaultTreatmentsAND = formData.treatmentsAND;
  const defaultMedicalConditionsOR = formData.medicalConditionsOR;
  const defaultMedicalConditionsAND = formData.medicalConditionsAND;

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
    formData.groupBy = (groupType === constants.groupType.Cohort) ? constants.groupType.Cohort : constants.groupType.PayerType;
  }

  const onChangeGroupBy = (event, filterType) => {
    switch (filterType) {
      case constants.groupType.Cohort:
        formData.cohorts = {
          ...formData.cohorts,
          [event.target.name]: event.target.checked,
        }
        break;

      case constants.groupType.PayerType:
        formData.payerType = {
          ...formData.payerType,
          [event.target.name]: event.target.checked,
        };
        break;
    }
  }

  const onChangeStates = (event) => {
    
    let statesData = event.map((data) => data.value);

    formData.states = states.filter(data=> statesData.includes(data.value)) 
  }

  const onChangeTreatment = (event, logic) =>{
    let treatments = event.map(data=> data.value);
    if (logic === constants.Logic.AND) {
        formData.treatmentsAND =  treatment.filter(data=> treatments.includes(data.value));

    }
    else if (logic === constants.Logic.OR) {
        formData.treatmentsOR = treatment.filter(data=> treatments.includes(data.value)) ;;
    }
  }

  const onChangeMedicalCondition = (event, logic) =>{
    let medicalConditions = event.map(data=> data.value);
    if (logic === constants.Logic.AND) {
        formData.medicalConditionsAND = medicalCondition.filter(data=> medicalConditions.includes(data.value));
    }
    else if (logic === constants.Logic.OR) {
        formData.medicalConditionsOR = medicalCondition.filter(data=> medicalConditions.includes(data.value));
    }
  }

  const validateFormData = (formData) =>{
    if(formData.groupBy && formData.treatmentsAND.length!=0 && formData.treatmentsOR.length!=0 && formData.medicalConditionsAND.length!=0 && formData.medicalConditionsOR.length!=0){
      return true;
    }
    return false;
  }

  useEffect(() => {
    if(validateFormData(formData)){
      props.onChangeFormData(formData);
    }
  }, [formData])

  const GroupData = () => {
    if (formData.groupBy == constants.groupType.Cohort) {
      return (
        <FormGroup className="form-group">
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
    else if (formData.groupBy == constants.groupType.PayerType) {
      return (
        <FormGroup className="form-group" >
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
  }

  return (
    <div className="filters">
      <FormGroup classsName="form-group">
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

      <FormGroup classsName="form-group">
        <FormLabel component="legend">States</FormLabel>
        <Select
          defaultValue={defaultStates}
          isMulti
          name="states"
          styles={customStyles}
          options={states}
          onChange={(e) => onChangeStates(e)}
          classNamePrefix="select" />
      </FormGroup>
      <br />
      <FormGroup classsName="form-group">
        <FormLabel component="legend">Treatment with AND</FormLabel>
        <Select
          isMulti
          name="treatmentAND"
          defaultValue={defaultTreatmentsAND}
          styles={customStyles}
          options={treatment}
          onChange={(e) => onChangeTreatment(e, constants.Logic.AND)}
          classNamePrefix="select"
        />
      </FormGroup>
      <br />
      <FormGroup classsName="form-group">
        <FormLabel component="legend">Treatment with OR</FormLabel>
        <Select
          isMulti
          name="treatmentOR"
          defaultValue={defaultTreatmentsOR}
          styles={customStyles}
          options={treatment}
          onChange={(e) => onChangeTreatment(e, constants.Logic.OR)}
          classNamePrefix="select"
        />
      </FormGroup>
      <br />
      <FormGroup classsName="form-group">
        <FormLabel component="legend">Medical Conditions with AND</FormLabel>
        <Select
          isMulti
          name="colors"
          defaultValue={defaultMedicalConditionsOR}
          styles={customStyles}
          options={medicalCondition}
          onChange={(e) => onChangeMedicalCondition(e, constants.Logic.AND)}
          classNamePrefix="select"
        />
      </FormGroup>
      <br />
      <FormGroup classsName="form-group">
        <FormLabel component="legend">Medical Condtions with OR</FormLabel>
        <Select
          isMulti
          name="colors"
          defaultValue={defaultMedicalConditionsAND}
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