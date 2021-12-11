import React from 'react'
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { register } from '../../store/utils/thunkCreators';
import { useDispatch } from 'react-redux';
import FormGroup from '@mui/material/FormGroup';
import {validateName, validateEmail} from '../Common/validation';

export const Register = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [retype, setRetype] = useState('');
    const [errorStatus, setErrorStatus] = useState({error: true, message: ""});

    const messageBoxId = 'register-message', maxLength=128;

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (username && password && fullName && email && !errorStatus.error && retype && retype===password) {
            dispatch(register({username, password, fullName, email}));
        }
    }

    return (
        <div>
                <div id="register-message"><p></p></div>
                <FormGroup className="form-group" controlId="username">
                    <TextField type="text" className="form-input" label="Username" variant="standard"  onChange={(e) => {
                        /* Name Validation Checking */
                        const errorStat = validateName(e.target.value);
                        setErrorStatus(errorStat);
                        if(errorStat.error){
                            document.getElementById(messageBoxId).firstElementChild.textContent = `Username must only contain (0-9), (A-Z), (a-z) or spaces with max ${maxLength} characters.`;
                            document.getElementById(messageBoxId).style.visibility = "visible";
                        }else{
                            document.getElementById(messageBoxId).style.visibility = "hidden";
                        }
                        return setUsername(e.target.value)
                    }} required />
                </FormGroup>

                <FormGroup className="form-group" controlId="email">
                    <TextField type="email" className="form-input" label="Email" variant="standard" onChange={(e) => {
                        /* Email Validation Checking */
                        const errorStat = validateEmail(e.target.value);
                        setErrorStatus(errorStat);
                        if(errorStat.error){
                            document.getElementById(messageBoxId).firstElementChild.textContent = errorStat.message;
                            document.getElementById(messageBoxId).style.visibility = "visible";
                        }else{
                            document.getElementById(messageBoxId).style.visibility = "hidden";
                        }
                        return setEmail(e.target.value)
                    }} required />
                </FormGroup>

                <FormGroup className="form-group" controlId="fullName">
                    <TextField type="text" className="form-input" label="Full Name" variant="standard" onChange={(e) => {
                        /* Name Validation Checking */
                        const errorStat = validateName(e.target.value);
                        setErrorStatus(errorStat);
                        if(errorStat.error){
                            document.getElementById(messageBoxId).firstElementChild.textContent = `Fullname must only contain (0-9), (A-Z), (a-z) or spaces with max ${maxLength} characters.`;
                            document.getElementById(messageBoxId).style.visibility = "visible";
                        }else{
                            document.getElementById(messageBoxId).style.visibility = "hidden";
                        }
                        setFullName(e.target.value)
                    }} required />
                </FormGroup>

                <FormGroup className="form-group" controlId="password">
                    <TextField
                        label="Password"
                        type="password"
                        className="form-input"
                        variant="standard"
                        autoComplete="current-password"
                        onChange={(e) => {
                            var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
                            var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
                            if(strongRegex.test(e.target.value)){
                                document.getElementById("pwd-measure").style.width = "100%";
                                document.getElementById("pwd-measure").style.backgroundColor = "green";
                            }else if(mediumRegex.test(e.target.value)){
                                document.getElementById("pwd-measure").style.width = "60%";
                                document.getElementById("pwd-measure").style.backgroundColor = "yellow";
                            }else{
                                document.getElementById("pwd-measure").style.width = "30%";
                                document.getElementById("pwd-measure").style.backgroundColor = "red";
                            }
                            setPassword(e.target.value);
                        }} required />
                </FormGroup>
                <div style={{width: '90%', margin: '1px auto'}}>
                    <small>Password Strength</small>
                    <div id="pwd-measure"></div>
                </div>
                <FormGroup className="form-group" controlId="retype_password">
                    <TextField
                        label="Retype Password"
                        type="password"
                        className="form-input"
                        variant="standard"
                        onChange={(e) => {
                            if(e.target.value!==password){
                                document.getElementById(messageBoxId).firstElementChild.textContent = `Passwords don't match!`;
                                document.getElementById(messageBoxId).style.visibility = "visible";
                            }else{
                                document.getElementById(messageBoxId).style.visibility = "hidden";
                            }
                            setRetype(e.target.value);
                        }} required />
                </FormGroup>
                <Button type="submit" sx={{width:'50%'}} color="primary" variant="contained" onClick={handleFormSubmit}>Register</Button>
        </div>
    )
}

export default React.memo(Register)