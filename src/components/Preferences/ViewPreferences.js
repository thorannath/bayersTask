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
import TablePagination from '@mui/material/TablePagination';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from 'axios'
import Cookies from 'js-cookie';


function createData(id, name, createdAt) {
    return { id, name, createdAt };
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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = (event, newPage) => { setPage(newPage) };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0)
    };


    const [rowData, setRowData] = useState([]);

    let prefData = props.preferences.map(data => {
        return createData(data.id, data.saveName, data.createdAt);
    });
    setRowData([...prefData]);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const handleOpenDeleteModal = () => setOpenDeleteModal(true);
    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const [deletePreference, setDeletePreference] = useState({});

    const handleCancel = () => {
        props.closeModal({ type: 'view', action: 'close' });
    }

    const openSettings = (row) => {
        props.closeModal({ type: 'view', action: 'view', data: row });
    }

    const editSettings = (row) => {
        props.closeModal({ type: 'view', action: 'edit', data: row });
    }

    const deleteSettings = (row) => {
        setDeletePreference({ ...row });
        handleOpenDeleteModal();
    }

    const onConfirmDelete = async () => {
        let preference = deletePreference;
        let userid = Cookies.get('userid', { path: '/' });
        let authToken = Cookies.get('authToken', { path: '/' });
        const response = await axios.delete('http://localhost:3000/users/preferences', { userid, authToken, preferenceId: preference.id });
        if (response.success) {

        }
        else {

        }
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
                            <TableCell>Default</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rowData
                            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                            ))}
                    </TableBody>
                </Table>
                {/* <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}
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
