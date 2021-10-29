import React from 'react'
import Form from 'react-bootstrap/Form';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { useState, forwardRef} from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Cookies from 'js-cookie';
import { useHistory } from "react-router-dom";
import { validateName } from '../common/validation';
import { validateEmail } from '../common/validation';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  

export const Register = () => {
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [retype, setRetype] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('error');
    const [errorStatus, setErrorStatus] = useState({error: true, message: ""});
    const messageBoxId = 'register-message', maxLength=128;


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (username && password && fullName && email && !errorStatus.error && retype && retype===password) {
            try{
                const response = await axios.post('http://localhost:3000/users/register', {userid: username, password, fullName, email})
                console.log(response);
                if (response && Number(response.data.success)) {
                        setMessage(response.data.message);
                        setSeverity('success');
                        Cookies.set('userid', username, {expires: 1, path:'/'}); 
                        Cookies.set('password', password, {expires: 1, path:'/'});
                        Cookies.set('authToken', response.data.userData.authToken, {expires: 1, path:'/'});
                        history.push("/app/patient-finder");
                }
                else {
                    setSeverity('error');
                    setMessage(response.data.message);
                }
            }catch(err){
                setSeverity('error');
                setMessage(err.response.data.message);
            }
        }
        else{
            setSeverity('error');
            setMessage("Please enter valid information to register!");
        }
        setOpen(true);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      };

    return (
        <div>
            <Form>
                <div id="register-message"><p>Message<br/>Message</p></div>
                <Form.Group className="form-group" controlId="username">
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
                </Form.Group>

                <Form.Group className="form-group" controlId="email">
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
                </Form.Group>

                <Form.Group className="form-group" controlId="fullName">
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
                </Form.Group>

                <Form.Group className="form-group" controlId="password">
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
                </Form.Group>
                <div style={{width: '90%', margin: '1px auto'}}>
                    <small>Password Strength</small>
                    <div id="pwd-measure"></div>
                </div>
                <Form.Group className="form-group" controlId="retype_password">
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
                </Form.Group>
                <Button type="submit" sx={{width:'50%'}} color="primary" variant="contained" onClick={handleFormSubmit}>Register</Button>
            </Form>
            
            
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity={severity}>{message}</Alert>
            </Snackbar>
        </div>
    )
}

export default Register