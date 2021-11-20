import React, { useState, useEffect, forwardRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Login from './Login';
import Register from './Register';
import './Authentication.css';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { loginAction } from '../../store/users';
import Cookies from 'js-cookie';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const LoginRef = forwardRef(function Login(props, ref) {
    return <Login/>;
});

const RegisterRef = forwardRef(function Register(props, ref) {
    return <Register/>;
});

const Authentication = () => {

    const dispatch = useDispatch();

    if(Cookies.get('userid', {path:'/'})){
        dispatch(loginAction());
    }
    const history = useHistory();
    const authenticationErrors = useSelector(state => state.authenticationErrors);
    const userStatus = useSelector(state => state.users);

    const [open, setOpen] = useState(false);
    const [authType, setAuthType] = useState('login');
    const [message, setMessage] = useState('');

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    useEffect(() => {
        if (userStatus.isLoggedIn) {
            history.push("/app/patient-finder");
            return;
        }
        else if (authenticationErrors.errorType) {
            setMessage(authenticationErrors.message);
            setOpen(true);
        }
    }, [authenticationErrors, userStatus]);


    useEffect(() => {
        setTimeout(() => {
            setOpen(false);
        }, 1500)
    }, [open])

    const Auth = () => {
        return authType === 'login' ? <Login/> : <Register />
    }

    const handleAuth = (type) => {
        setAuthType(type);
    }

    return (
        <div className="container-fluid">
            <div className="card">
                <ButtonGroup className="btn-group" variant="outlined">
                    <Button
                        className={authType === 'login' ? 'active' : ''}
                        onClick={() => handleAuth('login')} ><h3>Login</h3></Button>
                    <Button
                        className={authType === 'register' ? 'active' : ''}
                        onClick={() => handleAuth('register')}><h3>New User</h3></Button>
                </ButtonGroup>
                <div style={styles.title}>
                    <h2> Welcome to the Patients Finder!</h2>
                </div>
                <div className="auth-container">
                    <Auth />
                </div>
            </div>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity='error'>{message}</Alert>
            </Snackbar>
        </div>
    );
}

const styles = {
    title: {
        borderBottom: '2px solid grey',
        padding:5
    }
}

export default Authentication
