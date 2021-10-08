import React from 'react'
import * as constants from '../../Constant';
import FormGroup from '@mui/material/FormGroup';
import { FormControlLabel } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import makeAnimated from 'react-select/animated';
import Select, { StylesConfig } from 'react-select';
import html2canvas from 'html2canvas';


export const Filters = (props) => {
  const payerType = constants.Paytype;
  const patientCohort = constants.Patient_Cohort;
  const states = constants.States.map(data=>{
    return {value:data, label:data}
  });

  const animatedComponents = makeAnimated();
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
              patientCohort.map((data,i) => {
                return <FormControlLabel key={`cohort-formgrp-${i}`}
                  control={
                    <Checkbox 
                      checked={cohort[data]} 
                      onChange={(e) => props.onChange(e, constants.groupType.Cohort)} 
                      name={data} />
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
              payerType.map((data,i) => {
                return <FormControlLabel key={`paytyp-formgrp-${i}`}
                  control={
                    <Checkbox checked={payType[data]}
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

  const handleStateChange = (e)=>{
    console.log(e);
  }


  const takeScreenshot = (e)=>{
    html2canvas(document.getElementById("medical-chart")).then(function(canvas) {
        var context=canvas.getContext('2d');
        context.drawImage(canvas);
              var link=document.createElement("a");
              link.href = canvas.toDataURL('image/jpg');   //function blocks CORS
              link.download = './medical_chart.jpg';
              link.click();
    });
  };

  return (
    <div className="filters">
      <div className="groupBy">
        <h3> Group By </h3>
        <RadioGroup
          aria-label="gender"
          defaultValue="cohort"
          name="radio-buttons-group"
          color="primary"
          onClick={(e) => props.onChangeGroup(e.target.value)}
        >
          <FormControlLabel value="cohort" control={<Radio />} label="Cohort" />
          <FormControlLabel value="paytype" control={<Radio />} label="Payer Type " />
        </RadioGroup>
      </div>

      <GroupData />

      <div className="">
        <h3> States </h3>
        <Select
          defaultValue={states}
          isMulti
          name="colors"
          options={states}
          onChange={(e) => props.onChangeStates(e)}
          classNamePrefix="select"
        />
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
        <span><Button color="primary" variant="contained" type="submit" onClick={props.onClick}> Update chart </Button></span>

        {/* Please view this button when the the graph data is available*/}
        <span style={{paddingLeft:"15px"}}><Button color="primary" variant="outlined"  onClick={(e)=>{takeScreenshot(e)}}>Take Screenshot</Button></span>
      </div>
    </div>
  )
}

export default Filters