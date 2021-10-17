import React from 'react'
import './Dashboard.css';
import Graph from './Graph';
import Filters from './Filters';
import axios from 'axios'
import { useState, useEffect } from 'react';
import * as constants from '../../Constant';
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import ViewPreferences from '../Preferences/ViewPreferences';
import CreatePreferences from '../Preferences/CreatePreferences';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import html2canvas from "html2canvas";
import jsPdf from "jspdf";


const Dashboard = () => {
    const states = constants.States;
    const colors = constants.colors;

    const [treatmentsChartData, setTreatmentsChartData] = useState({});
    const [medicalChartData, setMedicalChartData] = useState({});

    const [treatment, setTreatment] = useState([]);
    const [medicalCondition, setMedicalCondition] = useState([]);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [selectedTreatmentLabels, setSelectedTreatmentLabels] = useState([]);
    const [selectedMedicalConditionLabels, setSelectedMedicalConditionLabels] = useState([]);

    const initialData = {
        preferenceName: null,
        groupBy: constants.groupType.Cohort,
        states,
        cohorts: { ckd: true, diab: true, both: true },
        payType: { MCR: true, COM: true },
        treatmentsOR: null,
        treatmentsAND: null,
        medicalConditionsAND: null,
        medicalConditionsOR: null
    }

    const [formData, setFormData] = useState({ ...initialData });

    const handleOpenModal = (res) => {
        if (res.type == 'create') {
            setOpenCreateModal(true)
        }
        else {
            setOpenViewModal(true)
        }
    };

    const handleCloseModal = (res) => {
        if (res.type == 'create') {
            if (res.success) {
            }
            setOpenCreateModal(false)
        }
        else {
            if (res.action == 'edit') {
                console.log(res.data);
                setOpenCreateModal(true)
            }
            setOpenViewModal(false)
        }
    };

    const fetchGraphData = async () => {
        const request = requestObject();
        /* Later: Introduce  Authentication and Posting mechanism*/
        request.userid = Cookies.get("userid", { path: '/' });
        console.log(Cookies.get("userid", { path: '/' }));

        const treatmentResponse = await axios.post('http://localhost:5000/view-treatment', request);
        const res = treatmentResponse.data;
        res.treatments.labels.shift();
        res.treatments.data = res.treatments.data.map((e, i) => {
            const ALL_DATA = e.data.shift();
            const result = e.data.map((ele, i) => (ele / ALL_DATA * 100));
            return { type: e.type, data: result };
        });
        const treatmentsChart = createChartData(res.treatments);
        setTreatmentsChartData({ ...treatmentsChart });

        const medicalResponse = await axios.post('http://localhost:5000/view-medical', request);
        const res2 = medicalResponse.data;
        res2.medical_conditions.labels.shift();
        res2.medical_conditions.data = res2.medical_conditions.data.map((e, i) => {
            const ALL_DATA = e.data.shift();
            const result = e.data.map((ele, i) => (ele / ALL_DATA * 100));
            return { type: e.type, data: result };
        });

        const medicalChart = createChartData(res2.medical_conditions)
        setMedicalChartData({ ...medicalChart });
    }
    const fetchLabels = async () => {
        const labelsResponse = await axios.post('http://localhost:5000/labels');
        const labelData = labelsResponse.data.labels;
        let medicalConditions = labelData.filter(data => data.label_type == constants.labelTypes.MEDICAL_CONDITION);
        let treatments = labelData.filter(data => data.label_type == constants.labelTypes.TREATMENT);
        setMedicalCondition([...medicalConditions])
        setTreatment([...treatments])
        setSelectedTreatmentLabels([...treatments]);
        setSelectedMedicalConditionLabels([...medicalConditions]);
    }

    const createChartData = (obj) => {
        const chart = {
            labels: obj.labels,
            datasets: []
        }

        obj.data.map((val, index) => {
            chart.datasets.push({
                label: val.type,
                backgroundColor: colors[index],
                data: val.data
            })
        })
        return chart;
    }

    const requestObject = () => {
        const groupKeys = (formData.groupBy == constants.groupType.Cohort) ? formData.cohorts : formData.payType;
        const treatmentLabels = selectedTreatmentLabels.map((e, i) => { return e["label"] })
        const medicalConditionLabels = selectedMedicalConditionLabels.map((e, i) => { return e["label"] })

        const request = {
            group_condition: {
                group_by: formData.groupBy,
                selection: Object.keys(groupKeys).filter((e, i) => { return groupKeys[e] })
            },
            states: formData.states,
            treatments: {
                labels: treatmentLabels, //selectedTreatmentLabels,
                OR: formData.treatmentsOR,
                AND: formData.treatmentsAND,
            },
            medical_conditions: {
                labels: medicalConditionLabels, //selectedMedicalConditionLabels,
                OR: formData.medicalConditionsOR,
                AND: formData.medicalConditionsAND,
            }
        }

        return request;
    }

    const handleFormData = (data)=>{
        setFormData({...data});
    }

    const handleClick = () => {
        console.log(formData, 'Dashboard');
        fetchGraphData();
    }

    const handlePreferenceChange = (name) => {
        formData.preferenceName = name;
        setFormData({ ...formData });
    }

    const takeScreenshot = (e) => {
        html2canvas(document.getElementById("medical-chart"), {
          onclone: document => {
            document.getElementById("image-render-medical").style.visibility = "hidden";
          }
        }).then(canvas => {
    
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPdf("l", "mm", "a4");
          const width = pdf.internal.pageSize.getWidth();
          const height = pdf.internal.pageSize.getHeight();
          pdf.addImage(imgData, "JPEG", 0, 0, width, height);
          pdf.save(`medical-chart_${new Date().toISOString()}.pdf`);
        });
    
        html2canvas(document.getElementById("treatment-chart"), {
          onclone: document => {
            document.getElementById("image-render-treatment").style.visibility = "hidden";
          }
        }).then(canvas => {
    
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPdf("l", "mm", "a4");
          const width = pdf.internal.pageSize.getWidth();
          const height = pdf.internal.pageSize.getHeight();
          pdf.addImage(imgData, "JPEG", 0, 0, width, height);
          pdf.save(`treatment-chart_${new Date().toISOString()}.pdf`);
        });
      };

    useEffect(() => {
        fetchGraphData();
        fetchLabels();
    }, []);

    const treatmentsChartComponent = (
        <div id="treatment-chart">
            <h3> Treatment Chart </h3>
            <Graph chartData={treatmentsChartData} />
        </div>
    );

    const medicalChartComponent = (
        <div id="medical-chart">
            <h3> Medical Conditions Chart </h3>
            <Graph chartData={medicalChartData} />
        </div>
    );

    return (
        <div className="container">
            <div className="page_header">
                <h1> Patient Finder </h1>
                <FormControl sx={{ textAlign: 'center' }} variant="standard" sx={{ m: 1, minWidth: 200 }}>
                    <InputLabel id="demo-simple-select-standard-label">Choose a Preference</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={10}
                        onChange={handlePreferenceChange}
                        label="Age">
                        <MenuItem value="">
                            <em>Please Select</em>
                        </MenuItem>
                        <MenuItem value={10}>Preference 1</MenuItem>
                        <MenuItem value={20}>Preference 2</MenuItem>
                        <MenuItem value={30}>Preference 3</MenuItem>
                    </Select>
                </FormControl>
                <Stack className="btn-stack" spacing={2} direction="row">
                    <Button variant="contained" color="warning" onClick={() => { handleOpenModal({ type: 'create' }) }}> CREATE PREFRENCE </Button>
                    <Button variant="contained" color="info" onClick={() => { handleOpenModal({ type: 'view' }) }}> VIEW PREFRENCES </Button>
                </Stack>
            </div>

            <Filters
                formData={initialData}
                onChangeFormData= {handleFormData}
                treatment={treatment}
                medicalCondition={medicalCondition}
            />
            <div className="update-button">
                <span><Button color="primary" variant="contained" type="submit" onClick={handleClick}> Update chart </Button></span>

                {/* Please view this button when the the graph data is available*/}
                <span style={{ paddingLeft: "15px" }}><Button color="primary" variant="outlined" onClick={(e) => takeScreenshot(e)}>Take Screenshot</Button></span>
            </div>

            {treatmentsChartComponent}
            <hr />
            {medicalChartComponent}

            <Modal
                open={openCreateModal}
                onClose={() => handleCloseModal('create')}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}>
                <CreatePreferences
                    treatment={treatment}
                    medicalCondition={medicalCondition}
                    closeModal={(type) => handleCloseModal(type)} />
            </Modal>
            <Modal
                open={openViewModal}
                onClose={() => handleCloseModal('view')}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}>
                <ViewPreferences openModal={openViewModal} closeModal={(type) => handleCloseModal(type)} />
            </Modal>
        </div>
    )
}

export default Dashboard
