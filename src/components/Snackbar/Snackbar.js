import React from 'react'

const Snackbar = () => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert severity={severity}>{message}</Alert>

        </Snackbar>
    )
}

export default Snackbar
