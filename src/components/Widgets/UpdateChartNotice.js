import React, { useState, useEffect } from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal';
import eventBus from '../../services/EventBus';


const UpdateChartNotice = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        eventBus.on("updateChartNotice", ({status}) => {
          if(status){
            setOpen(true)
          }
          else{
            setOpen(false)
          }
        });
      }, []);


    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            disableAutoFocus={true}
            BackdropProps={{
                timeout: 500,
            }}>
            <Box style={styles.modalInfo}> <h3>Results are no longer upto date. Please click on Update!</h3></Box>
        </Modal>
    )
}

const styles = {
    modalInfo: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: 5,
        backgroundColor: 'whitesmoke',
        border: '2px solid #b22222',
        fontWeight: 'bold',
        height: '75px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 24,
        padding: 5
    }
}

export default UpdateChartNotice
