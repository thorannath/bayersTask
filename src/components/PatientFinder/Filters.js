import React from 'react'
import * as constants from '../../Constant';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import { FormControlLabel } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useEffect, useState } from 'react';
import MultipleSelect from '../Inputs/MultipleSelect';


export const Filters = (props) => {
  const payerType = constants.Paytype;
  const patientCohort = constants.Patient_Cohort;

  const states = Object.keys(constants.States).map(key => {
    return { value: constants.States[key], label: key }
  });

  const [formData, setFormData] = useState(props.formData);

  useEffect(() => {
    setFormData(props.formData);
  }, [props.formData]);

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

  const onChangeStates = (event) => {
    let formVal = { ...formData };
    let statesData = event.map((data) => data.value);
    formVal.states = states.filter(data => statesData.includes(data.value))
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
    else {
      return null
    }
  }

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


      <MultipleSelect
        options={states}
        name="states"
        label="States"
        value={formData.states}
        onChange={(e) => onChangeStates(e)}
      />
    </div>
  )
}

export default Filters