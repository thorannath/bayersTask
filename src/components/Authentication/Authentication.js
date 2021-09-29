import React from 'react'
import Login from './Login';
import Register from './Register';
import { Card, CardContent } from '@mui/material';
import './Authentication.css';

const Authentication = () => {
    return (
        <div className="container-fluid">
        <div className="column"></div>
        <div className ="card">
            <Login />
            <hr/>
            <Register />
        </div>
        </div>
    )
}

export default Authentication
