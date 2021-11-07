import React, { useRef, useEffect } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import * as constants from '../../Constant';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../../store/modals';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


const Patients = () => {
    const dispatch = useDispatch();

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () =>{
        // dispatch(closeModal({messageType: constants.MESSAGE_TYPES.VIEW_HEATMAP_PATIENTS, action: 'close'}));
        setOpen(false);
    }  

    const modalStatus = useSelector(state => state.modals);

    useEffect(() => {
        switch (modalStatus.messageType) {
            case constants.MESSAGE_TYPES.VIEW_HEATMAP_PATIENTS:
                if (modalStatus.action === 'open') {
                    // let preference = preferences.find(val => val.id === modalStatus.data.id);
                    // initialData.id = preference.id;
                    // initialData.saveName = preference.preferenceName;
                    handleOpen();
                }
                else if (modalStatus.action === 'close') {
                    // let preference = preferences.find(val => val.id === modalStatus.data.id);
                    // initialData.id = preference.id;
                    // initialData.saveName = preference.preferenceName;
                    handleClose();
                }
                break;
            default:
                break;
        }
    }, [modalStatus])



    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Text in a modal
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </Typography>
                </Box>
            </Modal>
        </div>
    )
}

export default Patients
