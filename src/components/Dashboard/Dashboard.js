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
import { textAlign } from '@mui/system';


const Dashboard = () => {
    const states = constants.States;
    const colors = constants.colors;

    const [treatmentsChartData, setTreatmentsChartData] = useState({});
    const [medicalChartData, setMedicalChartData] = useState({});

    const [cohort, setCohort] = useState({ ckd: true, diab: true, both: true });
    const [payType, setPayType] = useState({ MCR: true, COM: true })
    const [groupBy, setGroupBy] = useState(constants.groupType.Cohort);
    const [treatment, setTreatment] = useState([]);
    const [medicalCondition, setMedicalCondition] = useState([]);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);

    const [filterStates, setFilterStates] = useState(states);
    const [selectedTreatmentLabels, setSelectedTreatmentLabels] = useState([]);
    const [selectedMedicalConditionLabels, setSelectedMedicalConditionLabels] = useState([]);
    const [filterTreatmentAND, setFilterTreatmentAND] = useState(treatment);
    const [filterMedicalConditionAND, setFilterMedicalConditionAND] = useState(medicalCondition);
    const [filterTreatmentOR, setFilterTreatmentOR] = useState([]);
    const [filterMedicalConditionOR, setFilterMedicalConditionOR] = useState([]);

    const handleOpenModal = (type) => (type == 'create') ? setOpenCreateModal(true) : setOpenViewModal(true);
    const handleCloseModal = (type) => (type == 'create') ? setOpenCreateModal(false) : setOpenViewModal(false);

    const fetchGraphData = () => {

        const request = requestObject();

        /* Later: Introduce  Authentication and Posting mechanism*/
        request.userid = Cookies.get("userid", { path: '/' });
        console.log(Cookies.get("userid", { path: '/' }));

        axios.post('http://localhost:5000/view-treatment', request)
            .then((response) => {
                const res = response.data;
                res.treatments.labels.shift();
                res.treatments.data = res.treatments.data.map((e, i) => {
                    const ALL_DATA = e.data.shift();
                    const result = e.data.map((ele, i) => (ele / ALL_DATA * 100));
                    return { type: e.type, data: result };
                });

                const treatmentsChart = createChartData(res.treatments);

                setTreatmentsChartData({ ...treatmentsChart });
                //setMedicalChartData({...medicalChart});
                axios.post('http://localhost:5000/view-medical', request)
                    .then((response) => {
                        const res = response.data;
                        res.medical_conditions.labels.shift();
                        res.medical_conditions.data = res.medical_conditions.data.map((e, i) => {
                            const ALL_DATA = e.data.shift();
                            const result = e.data.map((ele, i) => (ele / ALL_DATA * 100));
                            return { type: e.type, data: result };
                        });

                        //const treatmentsChart = createChartData(res.treatments);
                        const medicalChart = createChartData(res.medical_conditions)
                        //setTreatmentsChartData({...treatmentsChart});
                        setMedicalChartData({ ...medicalChart });
                    });
            });
    }
    const fetchLabels = () => {
        return axios.post('http://localhost:5000/labels')
            .then(res => {
                let labelData = res.data.labels;
                let medicalConditions = labelData.filter(data => data.label_type == constants.labelTypes.MEDICAL_CONDITION);
                let treatments = labelData.filter(data => data.label_type == constants.labelTypes.TREATMENT);
                setMedicalCondition([...medicalConditions])
                setTreatment([...treatments])
                setSelectedTreatmentLabels([...treatments]);
                setSelectedMedicalConditionLabels([...medicalConditions]);
            });
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

        const groupKeys = (groupBy == constants.groupType.Cohort) ? cohort : payType;
        const treatmentLabels = selectedTreatmentLabels.map((e, i) => { return e["label"] })
        const medicalConditionLabels = selectedMedicalConditionLabels.map((e, i) => { return e["label"] })

        const request = {
            group_condition: {
                group_by: groupBy,
                selection: Object.keys(groupKeys).filter((e, i) => { return groupKeys[e] })
            },
            states: filterStates,
            treatments: {
                labels: treatmentLabels, //selectedTreatmentLabels,
                OR: filterTreatmentOR,
                AND: filterTreatmentAND
            },
            medical_conditions: {
                labels: medicalConditionLabels, //selectedMedicalConditionLabels,
                OR: filterMedicalConditionOR,
                AND: filterMedicalConditionAND
            }
        }

        return request;
    }

    const handleGroupBy = (group) => {
        if (group == constants.groupType.Cohort) {
            setGroupBy(constants.groupType.Cohort);
        }
        else if (group == constants.groupType.PayerType) {
            setGroupBy(constants.groupType.PayerType);
        }
    };

    const handleChange = (event, filterType) => {
        switch (filterType) {
            case constants.groupType.Cohort:
                setCohort({
                    ...cohort,
                    [event.target.name]: event.target.checked,
                });
                break;

            case constants.groupType.PayerType:
                setPayType({
                    ...payType,
                    [event.target.name]: event.target.checked,
                });
                break;
        }
    };

    const handleStates = (event) => {
        let states = event.map((data) => data.value);
        setFilterStates([...states]);
    };

    const handleTreatments = (event, logic) => {
        if (logic === constants.Logic.AND) {
            let treatments = filterTreatmentAND;
            if (event.target.checked) {
                treatments.push(event.target.value)
            }
            else {
                treatments = treatments.filter(data => data != event.target.value);
            }
            setFilterTreatmentAND([...treatments]);
        }
        else if (logic === constants.Logic.OR) {
            let treatments = filterTreatmentOR;
            if (event.target.checked) {
                treatments.push(event.target.value)
            }
            else {
                treatments = treatments.filter(data => data != event.target.value);
            }
            setFilterTreatmentOR([...treatments]);
        }
    };

    const handleMedicalConditions = (event, logic) => {
        if (logic === constants.Logic.AND) {
            let medicalConditions = filterMedicalConditionAND;
            if (event.target.checked) {
                medicalConditions.push(event.target.value)
            }
            else {
                medicalConditions = medicalConditions.filter(data => data != event.target.value);
            }
            setFilterMedicalConditionAND([...medicalConditions]);
        }
        else if (logic === constants.Logic.OR) {
            let medicalConditions = filterMedicalConditionOR;
            if (event.target.checked) {
                medicalConditions.push(event.target.value)
            }
            else {
                medicalConditions = medicalConditions.filter(data => data != event.target.value);
            }
            setFilterMedicalConditionOR([...medicalConditions]);
        }
    };

    const handleClick = () => {
        fetchGraphData();
    }

    const handlePreferences = () => {

    }

    const handlePreferenceChange = ()=>{
        
    }

    useEffect(() => {
        fetchGraphData();
        fetchLabels();
    }, [])


    let medicalChartComponent, treatmentsChartComponent;
    treatmentsChartComponent = (
        <div id="treatment-chart">
            <h3> Treatment Chart </h3>
            <Graph chartData={treatmentsChartData} />
        </div>
    );

    medicalChartComponent = (
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
                        label="Age"
                    >
                        <MenuItem value="">
                            <em>Please Select</em>
                        </MenuItem>
                        <MenuItem value={10}>Preference 1</MenuItem>
                        <MenuItem value={20}>Preference 2</MenuItem>
                        <MenuItem value={30}>Preference 3</MenuItem>
                    </Select>
                </FormControl>
                <Stack className="btn-stack" spacing={2} direction="row">
                    <Button variant="contained" color="warning" onClick={() => { handleOpenModal('create') }}> Create PREFRENCE </Button>
                    <Button variant="contained" color="info" onClick={() => { handleOpenModal('view') }}> VIEW PREFRENCES </Button>
                </Stack>
            </div>

            <Filters
                cohort={cohort}
                payType={payType}
                groupBy={groupBy}
                filterStates={filterStates}
                treatment={treatment}
                medicalCondition={medicalCondition}
                filterTreatmentAND={filterTreatmentAND}
                filterMedicalConditionAND={filterMedicalConditionAND}
                filterTreatmentOR={filterTreatmentOR}
                filterMedicalConditionOR={filterMedicalConditionOR}
                onClick={handleClick}
                onChange={handleChange}
                onChangeGroup={handleGroupBy}
                onChangeStates={handleStates}
                onChangeTreatment={handleTreatments}
                onChangeMedicalCondition={handleMedicalConditions}
            />
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
                    cohort={cohort}
                    payType={payType}
                    groupBy={groupBy}
                    filterStates={filterStates}
                    treatment={treatment}
                    medicalCondition={medicalCondition}
                    filterTreatmentAND={filterTreatmentAND}
                    filterMedicalConditionAND={filterMedicalConditionAND}
                    filterTreatmentOR={filterTreatmentOR}
                    filterMedicalConditionOR={filterMedicalConditionOR}
                    closeModal={(type)=>handleCloseModal(type)}
                    onClick={handleClick}
                    onChange={handleChange}
                    onChangeGroup={handleGroupBy}
                    onChangeStates={handleStates}
                    onChangeTreatment={handleTreatments}
                    onChangeMedicalCondition={handleMedicalConditions}
                    onCreatePreference={handlePreferences} />
            </Modal>

            <Modal
                open={openViewModal}
                onClose={() => handleCloseModal('view')}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}>
                <ViewPreferences openModal={openViewModal} closeModal={(type)=>handleCloseModal(type)}/>
            </Modal>
        </div>
    )
}

export default Dashboard
