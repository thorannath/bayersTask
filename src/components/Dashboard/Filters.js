import React from 'react'
import * as constants from '../../Constant';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import { FormControlLabel } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from 'react-select';
import html2canvas from "html2canvas";
import jsPdf from "jspdf";

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
  control: (control)=>({
    ...control,
    padding:4
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
  const payerType = constants.Paytype;
  const patientCohort = constants.Patient_Cohort;
  const states = constants.States.map(data => {
    return { value: data, label: data }
  });

  const cohort = props.cohort;
  const payType = props.payType;

  const treatment = props.treatment.map(data => {
    return { value: data.label_val, label: data.name }
  });

  const medicalCondition = props.medicalCondition.map(data => {
    return { value: data.label_val, label: data.name }
  });




  const GroupData = () => {
    if (props.groupBy == constants.groupType.Cohort) {
      return (
        <FormGroup className="form-group">
          <FormLabel component="legend">Cohort Type</FormLabel>
          <div row>
            {patientCohort.map((data, i) => {
              return <FormControlLabel key={`cohort-formgrp-${i}`}
                control={
                  <Checkbox
                    checked={cohort[data]}
                    onChange={(e) => props.onChange(e, constants.groupType.Cohort)}
                    name={data} />
                }
                label={data.toUpperCase()}
              />
            })}
          </div>
        </FormGroup>
      )
    }
    else if (props.groupBy == constants.groupType.PayerType) {
      return (
        <FormGroup className="form-group" >
          <FormLabel component="legend">Payer Type</FormLabel>
          <div row>
            {payerType.map((data, i) => {
              return <FormControlLabel key={`paytyp-formgrp-${i}`}
                control={
                  <Checkbox checked={payType[data]}
                    onChange={(e) => props.onChange(e, constants.groupType.PayerType)}
                    name={data} />
                }
                label={data} />
            })}
          </div>
        </FormGroup>
      )
    }
  }

  const takeScreenshot = (e) => {
    html2canvas(document.getElementById("medical-chart"), {
      onclone: document => {
        document.getElementById("image-render-medical").style.visibility = "hidden";
      }
    }).then(canvas => {

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPdf("l", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "JPEG", 0, 0, width, height);
      pdf.save(`medical-chart_${new Date().toISOString()}.pdf`);
    });

    html2canvas(document.getElementById("treatment-chart"), {
      onclone: document => {
        document.getElementById("image-render-treatment").style.visibility = "hidden";
      }
    }).then(canvas => {

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPdf("l", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "JPEG", 0, 0, width, height);
      pdf.save(`treatment-chart_${new Date().toISOString()}.pdf`);
    });
  };



  return (
    <div className="filters">
      <FormGroup classsName="form-group">
        <FormLabel component="legend">Group By</FormLabel>
        <RadioGroup row
          defaultValue="cohort"
          onClick={(e) => props.onChangeGroup(e.target.value)}
          name="radio-buttons-group">
          <FormControlLabel value="cohort" control={<Radio />} label="Cohort" />
          <FormControlLabel value="paytype" control={<Radio />} label="Payer" />
        </RadioGroup>
      </FormGroup>

      <GroupData />

      <FormGroup classsName="form-group">
        <FormLabel component="legend">States</FormLabel>
        <Select
          defaultValue={states}
          isMulti
          name="states"
          styles={customStyles}
          options={states}
          onChange={(e) => props.onChangeStates(e)}
          classNamePrefix="select" />
      </FormGroup>

      <FormGroup classsName="form-group">
        <FormLabel component="legend">Treatment with AND</FormLabel>
        <Select
          isMulti
          name="treatmentAND"
          styles={customStyles}
          options={treatment}
          onChange={(e) => props.onChangeTreatment(e, constants.Logic.AND)}
          classNamePrefix="select"
        />
      </FormGroup>
      <br />
      <FormGroup classsName="form-group">
        <FormLabel component="legend">Treatment with OR</FormLabel>
        <Select
          isMulti
          name="treatmentOR"
          styles={customStyles}
          options={treatment}
          onChange={(e) => props.onChangeTreatment(e, constants.Logic.OR)}
          classNamePrefix="select"
        />
      </FormGroup>

      <FormGroup classsName="form-group">
        <FormLabel component="legend">Medical Conditions with AND</FormLabel>
        <Select
          isMulti
          name="colors"
          styles={customStyles}
          options={medicalCondition}
          onChange={(e) => props.onChangeMedicalCondition(e, constants.Logic.AND)}
          classNamePrefix="select"
        />
      </FormGroup>
      <br />
      <FormGroup classsName="form-group">
        <FormLabel component="legend">Medical Condtions with OR</FormLabel>
        <Select
          isMulti
          name="colors"
          styles={customStyles}
          options={medicalCondition}
          onChange={(e) => props.onChangeMedicalCondition(e, constants.Logic.OR)}
          classNamePrefix="select"
        />
      </FormGroup>

      <div className="update-button">
        <span><Button color="primary" variant="contained" type="submit" onClick={props.onClick}> Update chart </Button></span>

        {/* Please view this button when the the graph data is available*/}
        <span style={{ paddingLeft: "15px" }}><Button color="primary" variant="outlined" onClick={(e) => { takeScreenshot(e) }}>Take Screenshot</Button></span>
      </div>
      <div id="image-render-medical"></div>
      <div id="image-render-treatment"></div>
    </div>
  )
}

export default Filters