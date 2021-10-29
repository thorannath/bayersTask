import * as React from 'react';
import Box from '@mui/material/Box'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { deletePreference } from '../../store/utils/thunkCreators';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal, showModal } from '../../store/modals';
import * as constants from '../../Constant';

function createData(id, saveName, createdAt) {
    return { id, saveName, createdAt };
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    boxShadow: 24,
};

const deleteModalstyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
};


const ViewPreferences = (props) => {

    const dispatch = useDispatch();
    const preferences = useSelector(state => state.preferences.preferences);

    useEffect(() => {
        let prefData = preferences? preferences.map(data => {
            return createData(data.id, data.saveName, data.createdAt);
        }):null;
        setRowData([...prefData]);
    }, [preferences]);

    const [rowData, setRowData] = useState([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const handleOpenDeleteModal = () => setOpenDeleteModal(true);
    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const [deletePreferenceData, setDeletePreferenceData] = useState({});

    const handleCancel = () => {
        dispatch(showModal({messageType:constants.MESSAGE_TYPES.VIEW_PREFERECNE, action:'close'}))
    }

    const openSettings = (row) => {
        dispatch(showModal({messageType:constants.MESSAGE_TYPES.VIEW_PREFERECNE, action:'close', data:{id:row.id}}))
    }

    const editSettings = (row) => {
        dispatch(showModal({messageType:constants.MESSAGE_TYPES.VIEW_PREFERECNE, action:'close'}))
        dispatch(showModal({messageType:constants.MESSAGE_TYPES.EDIT_PREFERENCE, action:'open', data:{id:row.id}}))
    }

    const deleteSettings = (row) => {
        setDeletePreferenceData({ ...row });
        handleOpenDeleteModal();
    }

    const onConfirmDelete = async () => {
        let preference = deletePreferenceData;
        dispatch(deletePreference(preference.id));
        handleCloseDeleteModal();
    }


    return (
        <Box sx={style}>
            <div align="right">
                <Button type="submit" onClick={handleCancel}><CloseIcon /></Button>
            </div>
            <TableContainer sx={{ padding: 2 }}>
                <Table stickyHeader sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Preference Name</TableCell>
                            <TableCell>Created at</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rowData.length>0 && rowData
                            .map((row) => (
                                <TableRow
                                    key={row.saveName}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {row.saveName}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <p>{row.createdAt}</p>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Apply"><Button color="primary" onClick={() => openSettings(row)}> <VisibilityIcon /></Button></Tooltip>
                                        <Tooltip title="Edit"><Button color="info" onClick={() => editSettings(row)}><EditIcon /></Button></Tooltip>
                                        <Tooltip title="Delete"><Button color="warning" onClick={() => deleteSettings(row)}><DeleteIcon /></Button></Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                            }
                            {
                                rowData===0 && <p style={{display:'block', textAlign:'right', fontWeight:'bold', padding:5}}> {rowData===0} No Preferences Available </p>
                            }
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}>
                <Box sx={deleteModalstyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h4">
                        Are you sure you want to delete the preference ?
                    </Typography>
                    <div align="right">
                        <Button variant="contained" sx={{ marginRight: 1 }} color="warning" onClick={onConfirmDelete}> Yes </Button>
                        <Button variant="contained" color="info" onClick={handleCloseDeleteModal}> No </Button>
                    </div>

                </Box>
            </Modal>
        </Box>
    )
}

export default ViewPreferences

/* TODO: 
    1. Saved Preferences are not updated without reloading page. 
    One solution is auto reloading the page. 
    Will fix on work on it using a better approach by next update. 
    (NOTE: This can become problematic if user A logs out and another user B log in to user A's preferences)

    2. Make Default is not connected to the API yet. Will fix by next iteration.


*/