import React from 'react'
import * as constants from '../../Constant';
import FormGroup from '@mui/material/FormGroup';
import { FormControlLabel } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CancelIcon from '@mui/icons-material/Cancel';
import makeAnimated from 'react-select/animated';

export const Filters = (props) => {
  const payerType = constants.Paytype;
  const patientCohort = constants.Patient_Cohort;
  const states = constants.States;

  const cohort = props.cohort;
  const payType = props.payType;
  const treatment = props.treatment;
  const medicalCondition = props.medicalCondition;

  const filterStates = props.filterStates;
  const filterTreatmentAND = props.filterTreatmentAND;
  const filterMedicalConditionAND = props.filterMedicalConditionAND;
  const filterTreatmentOR = props.filterTreatmentOR;
  const filterMedicalConditionOR = props.filterMedicalConditionOR;

  const GroupData = () => {
    if (props.groupBy == constants.groupType.Cohort) {
      return (
        <div className="groupType">
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
        <div className="groupType">
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

  const handleDelete = (e, val) => {
    e.preventDefault();
    let event = {
      target: {
        checked: false,
        name: val
      }
    }
    props.onChangeStates(event)
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

      {/* <div className="statesfilter">
        <h3>New States</h3>
        <Select multiple
          value={filterStates}
          renderValue={(selected) => 
            (
              <div>
              {selected.map((val)=>(
                <Chip
                key={val}
                label={val}
                name={val}
                deleteIcon={
                  <CancelIcon
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                }
                onDelete={(e)=> handleDelete(e, val)}
                color="primary"
                className="chips"
              />
              ))}
              </div>
            )}
            sx={{ width: 500, maxHeight:500 ,maxWidth: '100%', height:500}}>
          {states.map(val=>(
              <MenuItem key={val} value={val}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => props.onChangeStates(e)}
                    checked={!!filterStates.includes(val)}
                    name={val} />
                }
                label={val}
              />
            </MenuItem>
          ))}
        </Select>
      </div> */}

      <div className="states">
        <div>
          <h3>States</h3>
          <FormGroup>
            {
              states.map((data) => {
                return <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => props.onChangeStates(e)}
                      checked={!!filterStates.includes(data)}
                      name={data} />
                  }
                  label={data}
                />

              })
            }
          </FormGroup>
        </div>
      </div>

      <div className="treatment">
        <div>
          <h3>Treatments with AND</h3>
          <FormGroup>
            {
              treatment.map((data) => {
                return <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => props.onChangeTreatment(e, constants.Logic.AND)}
                      checked={!!filterTreatmentAND.find(val => data.label_val == val)}
                      name={data.name}
                      value={data.label_val} />
                  }
                  label={data.name}
                />

              })
            }
          </FormGroup>
        </div>
        <div>
          <h3>Treatments with OR</h3>
          <FormGroup>
            {
              treatment.map((data) => {
                return <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => props.onChangeTreatment(e, constants.Logic.OR)}
                      checked={!!filterTreatmentOR.find(val => data.label_val == val)}
                      name={data.name}
                      value={data.label_val} />
                  }
                  label={data.name}
                />
              })
            }
          </FormGroup>
        </div>
      </div>

      <div className="medical-conditions">
        <div>
          <h3>Medical Conditions with AND</h3>
          <FormGroup>
            {
              medicalCondition.map((data) => {
                return <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => props.onChangeMedicalCondition(e, constants.Logic.AND)}
                      checked={!!filterMedicalConditionAND.find(val => data.label_val == val)}
                      name={data.name}
                      value={data.label_val} />
                  }
                  label={data.name}
                />

              })
            }
          </FormGroup>
        </div>

        <div>
          <h3>Medical Conditions with OR</h3>
          <FormGroup>
            {
              medicalCondition.map((data) => {
                return <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => props.onChangeMedicalCondition(e, constants.Logic.OR)}
                      checked={!!filterMedicalConditionOR.find(val => data.label_val == val)}
                      name={data.name}
                      value={data.label_val} />
                  }
                  label={data.name}
                />
              })
            }
          </FormGroup>
        </div>
      </div>
      <div className="update-button">
        <Button color="primary" variant="contained" type="submit" onClick={props.onClick}> Update chart </Button>
      </div>
    </div>
  )
}

export default Filters