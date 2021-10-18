import React from 'react'
import MuiAlert from '@mui/material/Alert';
import { forwardRef } from 'react';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  
const Snackbar = (props) => {

    console.log(props.isOpen)

    const isOpen = props.isOpen;
    const message = props.message;
    const severity = props.severity

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    };

    return (
        <Snackbar
            open={isOpen}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <Alert severity={severity}>{message}</Alert>
        </Snackbar>
    )
}

export default Snackbar
