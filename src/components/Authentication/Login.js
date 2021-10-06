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

    const handleFormSubmit = () => {
        if (username && password) {
            axios.post('http://localhost:5000/login', { login_userid: username, login_password: password })
                .then((res) => {
                    if(res){
                        if (res.data.success) {
                            setMessage(res.data.message);
                            setSeverity('success');
                            /* --- FIXME => Later: change this to user_id & auth-token --- */
                            Cookies.set('userData', { userid: username, password: password }, {path:'/'}); 
                            history.push("/app/dashboard");
                        }
                        else {
                            setSeverity('error');
                            setMessage(res.data.message);
                            setOpen(true);
                        }
                    }
                    else{
                        setMessage("Invalid username or password");
                        setOpen(true);
                    }
                })
                .catch(e=>{
                    setMessage("Invalid username or password");
                    setOpen(true);
                })

        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };


    return (
        <div>
            <h1> Login </h1>
            <Form.Group className="form-group" controlId="username">
                <TextField id="outlined-basic" className="form-input" label="Username" variant="outlined" onChange={(e) => setUsername(e.target.value)} required />
            </Form.Group>
            <Form.Group className="form-group" controlId="password">
                <TextField
                    id="outlined-password-input"
                    label="Password"
                    className="form-input"
                    type="password"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>
            <Button type="submit" variant="contained" onClick={handleFormSubmit}>Login</Button>

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