import React, { useState } from 'react'
import Login from './Login';
import Register from './Register';
import './Authentication.css';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';

const Authentication = () => {

    const [authType, setAuthType] = useState('login');

    const Auth = (type) => {
        if(authType === 'login'){
            return (<Login/>)
        }
        else{
            return (<Register />)
        }
    }

    const handleAuth = (type) =>{
        setAuthType(type);
    }


    return (
        <div className="container-fluid">
            <div className="image">
                <h2> Bayer Project </h2>
            </div>
            <div className="card">
                <ButtonGroup className="btn-group"  variant="outlined">
                    <Button
                    className={authType === 'login' ? 'active' : ''}
                      onClick={()=> handleAuth('login')} ><h3>Login</h3></Button>
                    <Button
                    className={authType === 'register' ? 'active' : ''}
                    onClick={()=> handleAuth('register')}><h3>New User</h3></Button>
                </ButtonGroup>
                <br/>
                <br/>
                <h2> Hello User !!</h2>
                <br/>
                <br/>
                <hr/>
                <div class="auth-container">
                    <Auth />
                </div>
            </div>
        </div>
    )
}

export default Authentication
