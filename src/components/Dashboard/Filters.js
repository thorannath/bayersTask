import React from 'react'
import * as constants from '../../Constant';
import FormGroup from '@mui/material/FormGroup';
import { FormControlLabel } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useState, useEffect } from 'react';


export const Filters = (props) => {
  const payerType = constants.Paytype;
  const patientCohort = constants.Patient_Cohort;
  const states = constants.States;
  const cohort = props.cohort;
  const payType = props.payType;
  const [filterStates, setfilterStates] = useState(props.filterStates);

  useEffect(() => {
    setfilterStates(props.filterStates)
  }, [props.filterStates])


  const GroupData = () => {
    if (props.groupBy == constants.groupType.Cohort) {
      return (
        <div className="patient-cohort">
          <h3>Patient Cohort</h3>
          <FormGroup>
            {
              patientCohort.map((data) => {
                return <FormControlLabel
                  control={
                    <Checkbox checked={cohort[data]} onChange={(e) => props.onChange(e, constants.groupType.Cohort)} name={data} />
                  }
                  label={data.toUpperCase()}
                />
              })
            }
          </FormGroup>
        </div>
      )
    }
    else if (props.groupBy == constants.groupType.PayerType) {
      return (
        <div className="payer-type">
          <h3>Payer Type</h3>
          <FormGroup>
            {
              payerType.map((data) => {
                return <FormControlLabel
                  control={
                    <Checkbox
                      checked={payType[data]}
                      onChange={(e) => props.onChange(e, constants.groupType.PayerType)}
                      name={data} />
                  }
                  label={data}
                />
              })
            }
          </FormGroup>
        </div>
      )
    }
  }

  return (
    <div className="filters">

      <div className="groupBy">
        <h3> Group By </h3>
        <RadioGroup
          aria-label="gender"
          defaultValue="cohort"
          name="radio-buttons-group"
          onClick={(e) => props.onChangeGroup(e.target.value)}
        >
          <FormControlLabel value="cohort" control={<Radio />} label="Cohort" />
          <FormControlLabel value="paytype" control={<Radio />} label="Payer Type " />
        </RadioGroup>
      </div>

      <GroupData />

      <div className="states">
        <h3>States</h3>
        <FormGroup>
          {
            states.map((data) => {
              return <FormControlLabel
                control={
                  <Checkbox
                    checked={!!filterStates.includes(data)}
                    onChange={(e) => props.onChangeStates(e)}
                    name={data} />
                }
                label={data}
              />
              
            })
          }
        </FormGroup>
      </div>

      <div className="update-button">
        <Button color="primary" variant="contained" type="submit" onClick={props.onClick}> Update chart </Button>
      </div>
    </div>
  )
}

export default Filters