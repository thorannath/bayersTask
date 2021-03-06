import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import * as constants from '../../Constant';
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    overflowY: 'scroll',
    width: '50%',
    borderRadius: 3,
    bgcolor: 'background.paper',
    boxShadow: 24,
};

const Patients = (props) => {
    const [open, setOpen] = useState(false);
    const [stateSelected, setStateSelected] = useState()
    const modalStatus = useSelector(state => state.modals);

    useEffect(() => {
        switch (modalStatus.messageType) {
            case constants.MESSAGE_TYPES.VIEW_HEATMAP_PATIENTS:
                if (modalStatus.action === 'open') {
                    setStateSelected(modalStatus.data.name);
                    setOpen(true);
                }
                else if (modalStatus.action === 'close') {
                    setOpen(false);
                }
                break;
            default:
                break;
        }
    }, [modalStatus])

    return (
        <Modal
            open={open}
            onClose={()=> setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{...style, overflow: "hidden"}}>
                <div className="modal-header">
                    <Typography align="left" variant="h6"> View Patients in {stateSelected}</Typography>
                    <div className="modal-close">
                        <Button color="inherit" type="submit" onClick={()=> setOpen(false)}><CloseIcon /></Button>
                    </div>
                </div>
                <TableContainer sx={{ paddingBottom: 2, maxHeight: "500px" , overflowY: "scroll"}}>
                    <Table stickyHeader sx={{ minWidth: 650 }} size="small" aria-label="a dense table" >
                        <TableHead >
                            <TableRow>
                                <TableCell>Patient ID</TableCell>
                                <TableCell align="center">Sex</TableCell>
                                <TableCell align="center">Race</TableCell>
                                <TableCell align="center">Age</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{overflow: "hidden"}}>
                            {
                                (props.data instanceof Array && props.data.length>0)?(
                                    props.data.map(e=>{
                                        return(
                                            <TableRow key={e.patid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row">
                                                    <p>{e.patid}</p>
                                                </TableCell>
                                                <TableCell component="th" align="center" scope="row">
                                                    <p>{e.sex}</p>
                                                </TableCell>
                                                <TableCell component="th" align="center" scope="row">
                                                    <p>{e.race}</p>
                                                </TableCell>
                                                <TableCell component="th" align="center" scope="row">
                                                    <p>{e.pat_age}</p>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ): <TableRow >
                                    <TableCell colSpan={4} align="center"><b> No data available </b></TableCell>
                                    </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Modal>
    )
}

export default Patients
