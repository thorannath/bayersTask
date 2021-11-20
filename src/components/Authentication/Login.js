import { Button, TextField } from '@mui/material';
import './Authentication.css';
import Form from 'react-bootstrap/Form';
import { useState, forwardRef } from 'react';
import MuiAlert from '@mui/material/Alert';
import { useDispatch } from 'react-redux';
import { login } from '../../store/utils/thunkCreators';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const handleFormSubmit = async () =>{
        if (username && password) {
            dispatch(login({username, password}))
        }
    }
    
    return (
        <div className="login-cls">
            <Form.Group className="form-group" controlId="username">
                <TextField 
                id="outlined-basic" 
                type="text"
                className="form-input" 
                variant="standard"  
                label="Username" 
                value={username}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>
            <div>
            <Button type="submit" sx={{width:'50%'}} variant="contained" onClick={handleFormSubmit}>Login</Button>
            <Button sx={{width:'50%'}}>Forget Password</Button>
            </div>
        </div>
    )
}

export default Login