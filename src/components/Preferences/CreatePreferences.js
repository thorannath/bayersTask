import React from 'react'
import Box from '@mui/material/Box'
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { Button, TextField } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import './Preferences.css';
import { useState } from 'react';
import axios from 'axios'
import Cookies from 'js-cookie';
import CloseIcon from '@mui/icons-material/Close';
import Filters from '../Dashboard/Filters';
import * as constants from '../../Constant';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    overflowY: 'scroll',
    width: '50%',
    height: '90%',
    borderRadius:2,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
};

const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        width: state.selectProps.width,
        borderBottom: '1px solid grey',
        color: state.selectProps.menuColor,
        width:'50%',
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
          color:'whitesmoke',
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

//get /preferences?username=value

const CreatePreferences = (props) => {

    const initialData = props.loadFormData;

    const [name, setName] = useState(props.loadFormData.preferenceName);
    const [defaultVal, setDefaultVal] = useState(false);
    const [formData, setFormData] = useState({...initialData});

    const treatment = props.treatment;

    const medicalCondition = props.medicalCondition;

    const handleName = (event)=>{
        setName(event.target.value);
    }

    const handleDefault = (event) =>{
        setDefaultVal(event.target.checked);
    }

    const requestObject = () => {
        const groupKeys = (formData.groupBy == constants.groupType.Cohort) ? formData.cohorts : formData.payType;
        const treatmentLabels = props.treatment.map((e, i) => { return e["label"] })
        const medicalConditionLabels = props.medicalCondition.map((e, i) => { return e["label"] })

        const request = {
            userid: Cookies.get('userid', { path: '/' }),
            authToken: Cookies.get('authToken', { path: '/' }),
            saveName:name,
            makeDefault:defaultVal,
            jsonData:{
                group_condition:{
                    group_by: formData.groupBy,
                    selection: Object.keys(groupKeys).filter((e, i) => { return groupKeys[e] })
                },
                states:formData.states.map(data=> data.value),
                treatments: {
                    labels: treatmentLabels, //selectedTreatmentLabels,
                    OR: formData.treatmentsOR?formData.treatmentsOR.map(data=> data.value):null,
                    AND: formData.treatmentsAND?formData.treatmentsAND.map(data=> data.value):null,
                },
                medical_conditions: {
                    labels: medicalConditionLabels, //selectedMedicalConditionLabels,
                    OR: formData.medicalConditionsOR?formData.medicalConditionsOR.map(data=> data.value):null,
                    AND: formData.medicalConditionsAND?formData.medicalConditionsAND.map(data=> data.value):null,
                }
            }
        }

        return request;
    }

    const validateFormData = (formData) =>{
        if(formData.groupBy && formData.treatmentsAND.length!=0 && formData.treatmentsOR.length!=0 && formData.medicalConditionsAND.length!=0 && formData.medicalConditionsOR.length!=0){
          return true;
        }
        return false;
      };
    
    
    const handleFormSubmit = async () => {
        if(!validateFormData(formData)) return;

        const req = requestObject(); 
        if(initialData.saveName){
            req.preferenceId = initialData.id;
            let response = await axios.put('http://localhost:3000/users/preferences', req);
            if(response.success){
                props.closeModal({type:'create', action:'add', success:true, message:'Preference Edited sucessfully' });
            }
            else{
                props.closeModal({type:'create', action:'add', success:false, message:'Unable to add preference' });
            }
        }
        else{

            let response = await axios.post('http://localhost:3000/users/preferences', req);
            if(response.success){
                props.closeModal({type:'create', action:'add', success:true, message:'Preference Added sucessfully' });
            }
            else{
                props.closeModal({type:'create', action:'add', success:false, message:'Unable to add preference' });
            }
        }
    }

    const handleCancel = ()=>{
        props.closeModal({type:'create', action:'close'});
    }

    return (
        <div>
            <Box sx={style}>
            <div align="right">
                <Button type="submit" onClick={handleCancel}><CloseIcon /></Button>
            </div>
                <h2> Create a Preference </h2>
                <FormGroup className="form-group">
                    <TextField 
                    id="standard-basic" 
                    label="Preference Name" 
                    value={name}
                    onChange={handleName}
                    variant="standard" />
                </FormGroup>
                <Filters
                formData={formData}
                onChangeFormData= {setFormData}
                treatment={treatment}
                medicalCondition={medicalCondition}
                />
                <FormGroup className="form-group">
                    <FormControlLabel control={<Checkbox checked={formData.default} onChange={handleDefault}/>} label="Make this as default" />
                </FormGroup>
                <div align="right">
                    <Button type="submit" sx={{ width: '25%' }} variant="contained" onClick={handleFormSubmit}>Save</Button>
                    <Button type="submit" sx={{ width: '25%' }} color="warning" onClick={handleCancel}>Cancel</Button>
                </div>
            </Box>
        </div>
    )
}

export default CreatePreferences
