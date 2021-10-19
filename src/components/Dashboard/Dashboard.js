import React from 'react'
import './Dashboard.css';
import Graph from './Graph';
import Filters from './Filters';
import axios from 'axios'
import { useState, useEffect, useCallback } from 'react';
import * as constants from '../../Constant';
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import ViewPreferences from '../Preferences/ViewPreferences';
import CreatePreferences from '../Preferences/CreatePreferences';
import Select from '@mui/material/Select';
import html2canvas from "html2canvas";
import jsPdf from "jspdf";
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';

const Dashboard = () => {
    const colors = constants.colors;
    const [treatmentsChartData, setTreatmentsChartData] = useState({});
    const [medicalChartData, setMedicalChartData] = useState({});
    const [treatment, setTreatment] = useState([]);
    const [medicalCondition, setMedicalCondition] = useState([]);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [preferences, setPreferences] = useState([]);
    const [defaultPreference, setDefaultPreference] = useState('');

    const initialData = {
        preferenceName: null,
        groupBy: constants.groupType.Cohort,
        states: constants.States.map(data => { return { value: data, label: data } }),
        cohorts: { ckd: true, diab: true, both: true },
        payType: { MCR: true, COM: true },
        treatmentsOR: [],
        treatmentsAND: [],
        medicalConditionsAND: [],
        medicalConditionsOR: []
    }

    const [loadFormData, setLoadFormData] = useState({ ...initialData });
    const [formData, setFormData] = useState({ ...initialData });

    const handleOpenModal = (res) => {
        if (res.type == 'create') {
            setLoadFormData({...initialData});
            setOpenCreateModal(true)
        }
        else {
            setOpenViewModal(true)
        }
    };

    const handleCloseModal = (res) => {
        if (res.type == 'create') {
            if (res.success) {
                getPreferences();
            }
            setOpenCreateModal(false)
        }
        else {
            if (res.action == 'edit') {
                let data = loadPreferenceForm(res.data.id);
                console.log(data);
                setLoadFormData({ ...data })
                setOpenCreateModal(true)
                getPreferences();
            }
            else if (res.action == 'view') {
                let data = loadPreferenceForm(res.data.id);
                setFormData({ ...data });
            }
            setOpenViewModal(false)
        }
    };

    const loadPreferenceForm = useCallback((id) => {
        let preference = preferences.find(data => data.id == id);
        if (!preference) return null;

        let jsonData = preference.jsonData;
        const data = {
            preferenceName: preference.saveName,
            groupBy: jsonData.group_condition.group_by,
            states: jsonData.states.map(data=> { return {value:data, label:data}}),
            cohorts: { ckd: false, diab: false, both: false },
            payType: { MCR: true, COM: true },
            treatmentsOR: treatment.map(data => { if (jsonData.treatments.OR.includes(data.label_val)){ return { value: data.label_val, label: data.name}} return null}).filter(data => data),
            treatmentsAND: treatment.map(data => { if (jsonData.treatments.AND.includes(data.label_val)){return { value: data.label_val, label: data.name}} return null}).filter(data => data),
            medicalConditionsAND: medicalCondition.map(data => { if (jsonData.medical_conditions.AND.includes(data.label_val)){return { value: data.label_val, label: data.name }} return null}).filter(data => data),
            medicalConditionsOR: medicalCondition.map(data => { if (jsonData.medical_conditions.OR.includes(data.label_val)){return { value: data.label_val, label: data.name}} return null }).filter(data => data),
        };
        if (jsonData.group_condition.group_by == 'cohort') {
            for (const [type, bool] of Object.entries(data.cohorts)) {
                if (jsonData.group_condition.selection.includes(type)) {
                    data.cohorts[type] = true;
                }
            }
        }
        else {
            for (const [type, bool] of Object.entries(data.payType)) {
                if (jsonData.group_condition.selection.includes(type)) {
                    data.payType[type] = true;
                }
            }
        }
        return data;
    },[medicalCondition, preferences, treatment]);

    const fetchGraphData = async () => {
        const request = requestObject();
        /* Later: Introduce  Authentication and Posting mechanism*/
        // console.log(`request message ${JSON.stringify(request)}`);
        request.userid = Cookies.get("userid", { path: '/' });
        request.authToken = Cookies.get('authToken', { path: '/' });
        const treatmentResponse = await axios.post('http://localhost:3000/patientfinder/treatments', request);
        const res = treatmentResponse.data;
        res.treatments.labels.shift();
        res.treatments.data = res.treatments.data.map((e, i) => {
            const ALL_DATA = e.data.shift();
            const result = e.data.map((ele, i) => (ele / ALL_DATA * 100));
            return { type: e.type, data: result };
        });
        const treatmentsChart = createChartData(res.treatments);
        setTreatmentsChartData({ ...treatmentsChart });

        const medicalResponse = await axios.post('http://localhost:3000/patientfinder/medicals', request);
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
        let params = {
            userid: Cookies.get("userid", { path: '/' }),
            authToken: Cookies.get('authToken', { path: '/' }),
        }
        const labelsResponse = await axios.request({
                method: 'GET',
                url: 'http://localhost:3000/patientfinder/labels', 
                params: params /* Note: This is Query Parameters */
        });

        if (labelsResponse.status == 200) {
            const labelData = labelsResponse.data.labelData;
            let medicalConditions = labelData.filter(data => data.label_type == constants.labelTypes.MEDICAL_CONDITION);
            let treatments = labelData.filter(data => data.label_type == constants.labelTypes.TREATMENT);
            setMedicalCondition([...medicalConditions])
            setTreatment([...treatments]);
        }
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
        const treatmentLabels = treatment.map((e, i) => { return e["label"] })
        const medicalConditionLabels = medicalCondition.map((e, i) => { return e["label"] })
        console.log(treatmentLabels)
        const request = {
            jsonData: {
                group_condition: {
                    group_by: formData.groupBy,
                    selection: Object.keys(groupKeys).filter((e, i) => { return groupKeys[e] })
                },
                states: formData.states.map((e)=>e['value']),
                treatments: {
                    labels: treatmentLabels, //selectedTreatmentLabels,
                    OR: formData.treatmentsOR ? formData.treatmentsOR.map(data => data.value) : null,
                    AND: formData.treatmentsAND ? formData.treatmentsAND.map(data => data.value) : null,
                },
                medical_conditions: {
                    labels: medicalConditionLabels, //selectedMedicalConditionLabels,
                    OR: formData.medicalConditionsOR ? formData.medicalConditionsOR.map(data => data.value) : null,
                    AND: formData.medicalConditionsAND ? formData.medicalConditionsAND.map(data => data.value) : null,
                }
            }
        }

        return request;
    }

    const handleClick = () => {
        fetchGraphData();
    }

    const handlePreferenceChange = useCallback((event) => {
        setDefaultPreference(event);
        const data = loadPreferenceForm(event);

        if (data) {
            setFormData({ ...data });
        }
    },[loadPreferenceForm]);

    const getPreferences = async () => {
        const userid = Cookies.get('userid');
        const authToken = Cookies.get('authToken');
        const response = await axios.request({
            method: 'GET',
            url: 'http://localhost:3000/users/preferences', 
            params: { userid: userid, authToken: authToken }
        });
        
        if (response.data.success) {
            const preferencesData = response.data.preferenceData;
            let data = preferencesData.map(data => { return { value: data.id, label: data.saveName } });
            setPreferences([...preferencesData]);
            if (response.data.defaultPreferenceId) {
                handlePreferenceChange(response.data.defaultPreferenceId);
                let preference = preferencesData.find(data => data.id == response.defaultPreferenceId);
                if (preference) setDefaultPreference({ value: preference.id, label: preference.saveName });
            }
        }
    }

    useEffect(() => {
        if (preferences.length >0 && treatment.length>0 && medicalCondition.length>0) {
            handlePreferenceChange(preferences[0].id);
        }
    }, [preferences, treatment, medicalCondition, handlePreferenceChange])


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
        fetchLabels();
        getPreferences();
    }, [])

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
                <FormGroup className="form-group">
                    <FormLabel name="preferences">Select Preference</FormLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Preferences"
                        value={defaultPreference}
                        onChange={(e)=> handlePreferenceChange(e.target.value)}
                    >
                        <MenuItem value="">Please Select</MenuItem>
                        {preferences.map(data=>{
                            return (<MenuItem value={data.id}>{data.saveName}</MenuItem>)
                        })}
                    </Select>
                </FormGroup>
                <Stack className="btn-stack" spacing={2} direction="row">
                    <Button variant="contained" color="warning" onClick={() => { handleOpenModal({ type: 'create' }) }}> CREATE PREFRENCE </Button>
                    <Button variant="contained" color="info" onClick={() => { handleOpenModal({ type: 'view' }) }}> VIEW PREFRENCES </Button>
                </Stack>
            </div>

            <Filters
                formData={formData}
                onChangeFormData={setFormData}
                treatment={treatment}
                medicalCondition={medicalCondition}
            />
            <div className="update-button">
                <span><Button color="primary" variant="contained" type="submit" onClick={handleClick}> Update chart </Button></span>
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
                    loadFormData={loadFormData}
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
                <ViewPreferences
                    openModal={openViewModal}
                    closeModal={(type) => handleCloseModal(type)}
                />
            </Modal>
        </div>
    )
}

export default Dashboard
