import React, { useState, useEffect, forwardRef } from 'react';
import { Snackbar } from '@mui/material';
import eventBus from '../../../services/EventBus';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackbarError = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  useEffect(() => {
    eventBus.on("treatmentsGraphError", (data) => {
      setOpen(true);
      setMessage(data.message);
    });

    eventBus.on("medicalGraphError", (data) => {
      setOpen(true);
      setMessage(data.message);
    });

    eventBus.on("statesGraphError", (data) => {
      setOpen(true);
      setMessage(data.message);
    });
  }, [])

  useEffect(() => {
    return () => {
      eventBus.remove("treatmentsGraphError");
      eventBus.remove("medicalGraphError");
      eventBus.remove("statesGraphError");
    }
  }, [])


  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      onClick={handleClose}
      message={message}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      style={{cursor:'pointer'}}
    >
      <Alert severity="error">{message}</Alert>
    </Snackbar>
  )
}

export default SnackbarError
