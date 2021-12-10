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
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Typography from '@mui/material/Typography';
import { FormHelperText } from '@mui/material';

export const Filters = (props) => {
  const payerType = constants.Paytype;
  const patientCohort = constants.Patient_Cohort;

  const states = Object.keys(constants.States).map(key => {
    return { value: constants.States[key], label: key }
  });

  const [formData, setFormData] = useState(props.formData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setFormData(props.formData);
    if(props.formData.states.length == 0){
      setFormErrors({...formErrors, states: 'Select atleast one state'});
    }
    else{
      if(formErrors.hasOwnProperty('states'))delete formErrors.states;
    }
  }, [props.formData]);

  const onChangeGroup = (event) => {
    let groupType = event.target.value;
    if(!groupType){
      setFormErrors({...formErrors, 'groupType':'Group Type is required'});
    }
    else{
      if(formErrors.hasOwnProperty('groupType'))delete formErrors.groupType;
    }
    props.onChangeFormData({...formData,  groupBy: (groupType === constants.groupType.Cohort) ? constants.groupType.Cohort : constants.groupType.PayerType });
  }

  const onChangeGroupBy = (event, filterType) => {
    let formVal = { ...formData };
    switch (filterType) {
      case constants.groupType.Cohort:
        formVal.cohorts = {
          ...formVal.cohorts,
          [event.target.name]: event.target.checked,
        }
        validateCheckbox(formVal.cohorts,'cohort');
        break;

      case constants.groupType.PayerType:
        formVal.payType = {
          ...formVal.payType,
          [event.target.name]: event.target.checked,
        };
        validateCheckbox(formVal.payType,'paytype');
        break;
    }
    props.onChangeFormData(formVal);
  }

  const validateCheckbox = (data, type) => {
    if(Object.values(data).find(val=> val == true)){
      if(formErrors.hasOwnProperty([type]))delete formErrors[type];
    }
    else{
        setFormErrors({...formErrors, [type]: 'Slect atleast on checkbox'});
    }
  }

  const onChangeStates = (event) => {
    let formVal = { ...formData };
    let statesData = event.map((data) => data.value);
    formVal.states = states.filter(data => statesData.includes(data.value));

    if(formVal.states.length == 0){
      setFormErrors({...formErrors, states: 'Select atleast one state'});
    }
    else{
      if(formErrors.hasOwnProperty('states'))delete formErrors.states;
    }
    props.onChangeFormData(formVal);
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
                    {formErrors?.cohort && <FormHelperText id="error-message">{formErrors?.cohort}</FormHelperText>}
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
                    {formErrors?.paytype && <FormHelperText id="error-message">{formErrors?.paytype}</FormHelperText>}
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
        {formErrors?.groupBy && <FormHelperText id="error-message">{formErrors?.groupBy}</FormHelperText>}
      </FormGroup>

      <GroupData />

      <MultipleSelect
        options={states}
        name="states"
        label="States"
        value={formData.states}
        onChange={(e) => onChangeStates(e)}
      />
      {formErrors?.states && <FormHelperText id="error-message">{formErrors?.states}</FormHelperText>}
    </div>
  )
}

export default Filters