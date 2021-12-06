import React, { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Checkbox } from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import { FormControlLabel } from '@mui/material';
import { Button } from '@mui/material';
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import './Inputs.css';

// Labels format
// {
//     "NY":"New York",
//     "CA":'California'
// }

// formData format
// {
//     "NY":true,
//     "CA":true
// }

// formData format
// {
//     "value":"NY",
//     "label":"New york"
// }


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    overflowY: 'scroll',
    width: '40%',
    borderRadius: 3,
    bgcolor: 'background.paper',
    boxShadow: 24,
};

const accordianStyle = {
    padding: 2,
    boxShadow: 'none',
    borderBottom: '1px solid grey'
}

const AccordianCheckbox = ({ name, labels, data, onChange }) => {
    const [expanded, setExpanded] = useState(false);
    const [formData, setFormData] = useState({});


    const [selectAll, setSelectAll] = useState(false);

    const [open, setOpen] = useState(false);

    const handleAccordianChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {
        let mapData = {};
        if (data) {
            if (Object.keys(labels).length === Object.keys(data)) {
                setSelectAll(true);
            }

            data.map((val) => {
                mapData[val.value] = true;
            })
            setFormData(mapData);
        }

    }, [data]);

    const handleCheckboxChange = (e) => {
        let values = { ...formData };
        if (e.target.checked) {
            values = { ...formData, [e.target.name]: e.target.checked };
        }
        else delete values[e.target.name];
        let outputData = Object.keys(values).map((val) => { return { value: val, label: labels[val] } })
        onChange(outputData);
    }

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            let values = { ...labels };
            let outputData = Object.keys(values).map((val) => { return { value: val, label: values[val] } });
            onChange(outputData);
            setSelectAll(true);
        }
        else {
            setSelectAll(false);
            onChange([]);
        }
    }

    return (
        <div>
            <Accordion expanded={expanded === 'panel1'} disableGutters square key={name} style={accordianStyle} onChange={handleAccordianChange('panel1')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <FormLabel className="formLabel">{name}</FormLabel>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="checkbox-grid">
                        <FormControlLabel key='all'
                            control={
                                <Checkbox
                                    checked={selectAll}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                                    onChange={(e) => handleSelectAll(e)}
                                    name='all' />
                            }
                            label={<Typography variant="body2" color="textSecondary">Select All</Typography>} />
                        {
                            Object.keys(labels).slice(0, 5).map((value, i) => {
                                if (i < 4) {
                                    return (
                                        <FormControlLabel key={labels[value]}
                                            control={
                                                <Checkbox
                                                    checked={formData[value] || false}
                                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                                                    onChange={(e) => handleCheckboxChange(e)}
                                                    name={value} />
                                            }
                                            label={<Typography variant="body2" color="textSecondary">{labels[value]}</Typography>} />
                                    )
                                }
                                else {
                                    return (
                                        <div className="moreButton" key={labels[value]}>
                                            <Button onClick={() => setOpen(true)} >And More {Object.keys(labels).length - 5} </Button>
                                        </div>
                                    )
                                }
                            })
                        }

                    </div>
                </AccordionDetails>
            </Accordion>



            <Modal
                open={open}
                onClose={() => setOpen(false)}
                closeAfterTransition>
                <Box sx={style}>
                    <div className="modal-header">
                        <Typography align="left" variant="h6"> List of all {name} </Typography>
                        <div className="modal-close">
                            <Button type="submit" color="inherit" onClick={() => setOpen(false)}><CloseIcon /></Button>
                        </div>
                    </div>

                    <div className="checkbox-grid-4">
                        <FormControlLabel key='all'
                            control={
                                <Checkbox
                                    checked={selectAll}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                                    onChange={(e) => handleSelectAll(e)}
                                    name='all' />
                            }
                            label={<Typography variant="body2" color="textSecondary">Select All</Typography>} />
                        {
                            Object.keys(labels).map((value, i) => {
                                return (
                                    <FormControlLabel key={labels[value]}
                                        control={
                                            <Checkbox
                                                checked={formData[value] || false}
                                                sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                                                onChange={(e) => handleCheckboxChange(e)}
                                                name={value} />
                                        }
                                        label={<Typography variant="body2" color="textSecondary">{labels[value]}</Typography>} />
                                )
                            })
                        }
                    </div>
                    <div className="modal-footer">
                        <Button type="submit" sx={{ width: '25%' }} variant="contained" onClick={() => setOpen(false)}>Apply</Button>
                    </div>
                </Box>
            </Modal>

        </div>
    )
}

export default React.memo(AccordianCheckbox)
