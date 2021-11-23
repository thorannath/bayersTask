import React from 'react'
import { Modal } from '@mui/material';
import { useSelector } from 'react-redux';
import './Loader.css';

const Loader = () => {
    const isLoading = useSelector(state => state.loader.isLoading)

    return (
        <Modal
        open={isLoading}
        style={{outline:'none'}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <div className="lds-dual-ring">
            <h3 style={{color:'white'}}>Please Wait ...</h3>
        </div>
    </Modal>
    )
}


export default Loader
