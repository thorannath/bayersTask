import React, { useState } from 'react'
import Login from './Login';
import Register from './Register';
import './Authentication.css';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import BlurOnIcon from '@mui/icons-material/BlurOn';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';
import backgroundImage  from './backgroud_image.png'

const Authentication = () => {

    const [authType, setAuthType] = useState('login');

    const Auth = (type) => {
        if (authType === 'login') {
            return (<Login />)
        }
        else {
            return (<Register />)
        }
    }

    const handleAuth = (type) => {
        setAuthType(type);
    }

    if (!Cookies.get('userid', { path: '/' }) || !Cookies.get('password', { path: '/' })) { /* Later: use auth-token and perform authentication from backend*/
        return (
            <div className="container-fluid">
                <div className="image">
                    <img className="image_bg" src={backgroundImage}/>
                </div>
                <div className="card">
                    <ButtonGroup className="btn-group" variant="outlined">
                        <Button
                            className={authType === 'login' ? 'active' : ''}
                            onClick={() => handleAuth('login')} ><h3>Login</h3></Button>
                        <Button
                            className={authType === 'register' ? 'active' : ''}
                            onClick={() => handleAuth('register')}><h3>New User</h3></Button>
                    </ButtonGroup>
                    <br />
                    <br />
                    <h2> Welcome to the Patients Finder!</h2>
                    <br />
                    <hr />
                    <div className="auth-container">
                        <Auth />
                    </div>
                </div>
            </div>
        );
    } else {
        return <Redirect to="/app/introduction" />;
    }
}

export default Authentication
