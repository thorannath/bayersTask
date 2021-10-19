import React from 'react'
import Form from 'react-bootstrap/Form';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { useState, forwardRef} from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  

export const Register = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('error');


    const handleFormSubmit = async (e) => {
        if (username && password && fullName && email) {
            const response = await axios.post('http://localhost:3000/users/register', {userid: username, password, fullName, email})
            if (response && response.data.success) {
                setMessage('Successfully registered. Please login!');
                setSeverity('success');
            }
            else {
                setSeverity('error');
                setMessage(response.data.message);
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
            <Form.Group className="form-group" controlId="username">
                <TextField type="text" className="form-input" label="Username" variant="standard"  onChange={(e) => setUsername(e.target.value)} required />
            </Form.Group>

            <Form.Group className="form-group" controlId="email">
                <TextField type="email" className="form-input" label="Email" variant="standard" onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>

            <Form.Group className="form-group" controlId="fullName">
                <TextField type="text" className="form-input" label="Full Name" variant="standard" onChange={(e) => setFullName(e.target.value)} required />
            </Form.Group>

            <Form.Group className="form-group" controlId="password">
                <TextField
                    label="Password"
                    type="password"
                    className="form-input"
                    variant="standard"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
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