import React from 'react'
import { Button, TextField } from '@mui/material';
import './Authentication.css';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../store/utils/thunkCreators';
import FormGroup from '@mui/material/FormGroup';

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
            <FormGroup className="form-group">
                <TextField 
                id="outlined-basic" 
                type="text"
                className="form-input" 
                variant="standard"  
                label="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
                required 
                />
            </FormGroup>
            <FormGroup className="form-group">
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
            </FormGroup>
            <div>
            <Button type="submit" sx={{width:'50%'}} variant="contained" onClick={handleFormSubmit}>Login</Button>
            <Button sx={{width:'50%'}}>Forget Password</Button>
            </div>
        </div>
    )
}

export default React.memo(Login)