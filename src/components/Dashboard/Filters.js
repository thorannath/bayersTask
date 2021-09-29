import React from 'react'
import * as constants from '../../Constant';
import FormGroup from '@mui/material/FormGroup';
import { FormControlLabel, FormLabel } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

export const Filters = (props) => {


  // const states = constants.States;
  const payerType = constants.Paytype;
  const patientCohort = constants.Patient_Cohort;

  const cohort = props.cohort;
  const error = Object.keys(cohort).filter((v) => v).length !== 2;

  return (
    <div className="filters">

      <div className="groupBy">
        <RadioGroup
          aria-label="gender"
          defaultValue="cohort"
          name="radio-buttons-group"
        >
          <FormControlLabel value="cohort" control={<Radio />} onChange={props.onChangeGroup} label="Cohort" />
          <FormControlLabel value="paytype" control={<Radio />} onChange={props.onChangeGroup} label="Payer Type " />
        </RadioGroup>
      </div>

      <div className="patient-cohort">
        <h3>Patient Cohort</h3>
        <FormGroup>
          {
            patientCohort.map((data) => {
              return <FormControlLabel
                control={
                  <Checkbox checked={cohort[data]} onChange={(e) => props.onChange(e, 'cohort')} name={data} />
                }
                label={data}
              />
            })
          }
        </FormGroup>
      </div>
{/* 
      <div className="payer-type">
        <h3>Payer Type</h3>
        <FormGroup>
          {
            payerType.map((data) => {
              return <FormControlLabel
                control={
                  <Checkbox
                    // checked={cohort[data]} 
                    onChange={props.onChange} name={data} />
                }
                label={data}
              />
            })
          }
        </FormGroup>
      </div> */}

      <Button color="primary" variant="contained" type="submit" onClick={props.onClick}> Update chart </Button>
    </div>
  )
}

export default Filters