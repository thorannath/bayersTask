import { Button, TextField } from '@mui/material';
import './Authentication.css';
import Form from 'react-bootstrap/Form';
import { useState, forwardRef } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Cookies from 'js-cookie';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const Login = () => {
    const history = useHistory();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('error');

    const handleFormSubmit = async () => {
        if (username && password) {
            const response = await axios.put('http://localhost:3000/users', { userid: username, password: password})
            if (response && response.data.success) {
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
            setOpen(true);
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
    };
    
    return (
        <div className="login-cls">
            <Form.Group className="form-group" controlId="username">
                <TextField 
                id="outlined-basic" 
                type="text"
                className="form-input" 
                variant="standard"  
                label="Username" 
                onChange={(e) => setUsername(e.target.value)} required 
                />
            </Form.Group>
            <Form.Group className="form-group" controlId="password">
                <TextField
                    id="outlined-password-input"
                    label="Password"
                    className="form-input"
                    variant="standard" 
                    type="password"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>
            <div>
            <Button type="submit" sx={{width:'50%'}} variant="contained" onClick={handleFormSubmit}>Login</Button>
            <Button sx={{width:'50%'}}>Forget Password</Button>
            </div>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical:'top', horizontal:'right' }}
            > 
                <Alert severity={severity}>{message}</Alert>

            </Snackbar>

        </div>
    )
}

export default Login