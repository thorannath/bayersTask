import React from 'react'
import './PatientFinder.css';
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
import html2canvas from "html2canvas";
import jsPdf from "jspdf";
import { useSelector, useDispatch } from 'react-redux';
import { fetchLabels, getPreferences } from '../../store/utils/thunkCreators';
import SidebarFilters from './SidebarFilters';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Select from 'react-select';

const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid grey',
        color: state.selectProps.menuColor,
        width: '50%',
    }),
    option: (provided, state) => ({
        ...provided,
        padding: 20,
    }),
    control: (control) => ({
        ...control,
        padding: 4
    }),
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';
        return { ...provided, opacity, transition };
    },
    multiValue: (styles, { data }) => {
        return {
            ...styles,
            backgroundColor: '#ffae42',
            color: 'whitesmoke',
        };
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: data.color,
    }),
    multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: data.color,
        ':hover': {
            backgroundColor: data.color,
            color: 'white',
        },
    }),
}

const PatientFinder = () => {
    const treatments = useSelector(state => state.labels.treatments);
    const medicalConditions = useSelector(state => state.labels.medicalConditions);
    const preferences = useSelector(state => state.preferences.preferences);

    const treatment = useSelector(state => state.labels.treatments).map(data => {
        return { value: data.label_val, label: data.name }
    });
    const medicalCondition = useSelector(state => state.labels.medicalConditions).map(data => {
        return { value: data.label_val, label: data.name }
    });

    const [treatmentsSelected, setTreatmentsSelected] = useState(treatment);
    const [medicalConditionsSelected, setMedicalConditionsSelected] = useState(medicalCondition);

    const colors = constants.colors;
    const [treatmentsChartData, setTreatmentsChartData] = useState({});
    const [medicalChartData, setMedicalChartData] = useState({});

    var initialData = {
        preferenceId: '',
        preferenceName: '',
        groupBy: constants.groupType.Cohort,
        states: '',
        cohorts: { ckd: true, diab: true, both: true },
        payType: { MCR: true, COM: true },
        treatmentSelected:treatment,
        medicalConditionsSelected:medicalCondition,
        treatmentsOR: [],
        treatmentsAND: [],
        medicalConditionsAND: [],
        medicalConditionsOR: []
    }

    const [openViewModal, setOpenViewModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchLabels())
        dispatch(getPreferences());
    }, [dispatch])


    const [loadFormData, setLoadFormData] = useState({ ...initialData });
    const [formData, setFormData] = useState({ ...initialData });

    const handleOpenModal = (res) => {
        if (res.type === 'create') {
            setLoadFormData({ ...initialData });
            setOpenCreateModal(true)
        }
        else {
            setOpenViewModal(true)
        }
    };

    const handleCloseModal = (res) => {
        if (res.type === 'create') {
            setOpenCreateModal(false)
        }
        else {
            if (res.action === 'edit') {
                let data = loadPreferenceForm(res.data.id);
                setLoadFormData({ ...data })
                setOpenCreateModal(true)
            }
            else if (res.action === 'view') {
                let data = loadPreferenceForm(res.data.id);
                setFormData({ ...data });
            }
            setOpenViewModal(false)
        }
    };

    const loadPreferenceForm = useCallback((id) => {
        let preference = preferences.find(data => data.id === id);
        if (!preference) return null;

        let jsonData = preference.jsonData;
        const data = {
            preferenceId: preference.id,
            preferenceName: preference.saveName,
            groupBy: jsonData.group_condition.group_by,
            states: jsonData.states.map(data => { return { value: data, label: data } }),
            cohorts: { ckd: false, diab: false, both: false },
            payType: { MCR: false, COM: false },
            treatmentsOR: treatments.map(data => { if (jsonData.treatments.OR.includes(data.label_val)) { return { value: data.label_val, label: data.name } } return null }).filter(data => data),
            treatmentsAND: treatments.map(data => { if (jsonData.treatments.AND.includes(data.label_val)) { return { value: data.label_val, label: data.name } } return null }).filter(data => data),
            medicalConditionsAND: medicalConditions.map(data => { if (jsonData.medical_conditions.AND.includes(data.label_val)) { return { value: data.label_val, label: data.name } } return null }).filter(data => data),
            medicalConditionsOR: medicalConditions.map(data => { if (jsonData.medical_conditions.OR.includes(data.label_val)) { return { value: data.label_val, label: data.name } } return null }).filter(data => data),
        };
        if (jsonData.group_condition.group_by === 'cohort') {
            for (const [type] of Object.entries(data.cohorts)) {
                if (jsonData.group_condition.selection.includes(type)) {
                    data.cohorts[type] = true;
                }
            }
        }
        else {
            for (const [type] of Object.entries(data.payType)) {
                if (jsonData.group_condition.selection.includes(type)) {
                    data.payType[type] = true;
                }
            }
        }
        return data;
    }, [medicalConditions, preferences, treatments]);

    const fetchGraphData = async () => {
        const request = requestObject();
        /* Later: Introduce  Authentication and Posting mechanism*/
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
            });
            return;
        })
        return chart;
    }

    const requestObject = () => {
        const groupKeys = (formData.groupBy === constants.groupType.Cohort) ? formData.cohorts : formData.payType;
        const treatmentLabels = treatmentsSelected.map(data => {

            let treatment = treatments.find(val => val.label_val == data.value);
            if (treatment) return treatment.label;
        });
        const medicalConditionLabels = medicalConditionsSelected.map((data) => {

            let medicalCondition = medicalConditions.find(val => val.label_val == data.value);
            if (medicalCondition) return medicalCondition.label;
        });
        const request = {
            jsonData: {
                group_condition: {
                    group_by: formData.groupBy,
                    selection: Object.keys(groupKeys).filter((e, i) => { return groupKeys[e] })
                },
                states: formData.states.map((e) => e['value']),
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

        console.log(request)
        return request;
    }

    const handleClick = () => {
        fetchGraphData();
    }

    const handleReset = () => {
        setFormData({ ...initialData });
    }

    const handlePreferenceChange = useCallback((event) => {
        const data = loadPreferenceForm(event);

        if (data) {
            setFormData({ ...data });
        }
    }, [loadPreferenceForm]);


    const takeScreenshot = () => {
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

    const onChangeTreatment = (event, logic) => {
        let treatments = event.map(data => data.value);
        let formVal = { ...formData };
        if (logic === constants.Logic.AND) {
            formVal.treatmentsAND = treatment.filter(data => treatments.includes(data.value));

        }
        else if (logic === constants.Logic.OR) {
            formVal.treatmentsOR = treatment.filter(data => treatments.includes(data.value));

        }
        setFormData({ ...formVal });
    }

    const onChangeMedicalCondition = (event, logic) => {
        let medicalConditions = event.map(data => data.value);
        let formVal = { ...formData };
        if (logic === constants.Logic.AND) {
            formVal.medicalConditionsAND = medicalCondition.filter(data => medicalConditions.includes(data.value));
        }
        else if (logic === constants.Logic.OR) {
            formVal.medicalConditionsOR = medicalCondition.filter(data => medicalConditions.includes(data.value));
        }
        setFormData({ ...formVal });
    }

    const onChangeTreatmentSelected = (event) => {
        let res = event.map(data => data.value);
        let treatments = treatment.filter(data => res.includes(data.value));
        setTreatmentsSelected([...treatments]);
    }

    const onChangeMedicalConditionsSelected = (event) => {
        let res = event.map(data => data.value);
        let medicalConditions = medicalCondition.filter(data => res.includes(data.value));
        setMedicalConditionsSelected([...medicalConditions]);
    }

    return (
        <div className="container">
            <SidebarFilters
                formData={formData}
                onChangeFormData={setFormData}
                onUpdateChart={handleClick}
                onResetChart={handleReset}
                onCreatePreference={() => { handleOpenModal({ type: 'create' }) }}
                onViewPreference={() => { handleOpenModal({ type: 'view' }) }}
                onChangePreference={(id) => handlePreferenceChange(id)}
                onTakeScreenshot={takeScreenshot}/>
            <div className="main">
                {treatmentsChartComponent}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '30px' }}>
                    <FormGroup>
                        <FormLabel component="legend">Treatment with AND</FormLabel>
                        <Select
                            isMulti
                            name="treatmentAND"
                            value={formData.treatmentsAND}
                            styles={customStyles}
                            options={treatment}
                            onChange={(e) => onChangeTreatment(e, constants.Logic.AND)}
                            classNamePrefix="select"
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel component="legend">Treatment with OR</FormLabel>
                        <Select
                            isMulti
                            name="treatmentOR"
                            value={formData.treatmentsOR}
                            styles={customStyles}
                            options={treatment}
                            onChange={(e) => onChangeTreatment(e, constants.Logic.OR)}
                            classNamePrefix="select"
                        />
                    </FormGroup>
                </div>
                <FormGroup className="">
                    <FormLabel component="legend">Select Focus Labels</FormLabel>
                    <Select
                        isMulti
                        name="selectLabels"
                        value={treatmentsSelected}
                        styles={customStyles}
                        options={treatment}
                        onChange={onChangeTreatmentSelected}
                        classNamePrefix="select"
                    />
                </FormGroup>
                <hr />
                {medicalChartComponent}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '30px' }}>
                    <FormGroup className="">
                        <FormLabel component="legend">Medical Conditions with AND</FormLabel>
                        <Select
                            isMulti
                            name="colors"
                            value={formData.medicalConditionsAND}
                            styles={customStyles}
                            options={medicalCondition}
                            onChange={(e) => onChangeMedicalCondition(e, constants.Logic.AND)}
                            classNamePrefix="select"
                        />
                    </FormGroup>
                    <FormGroup className="">
                        <FormLabel component="legend">Medical Condtions with OR</FormLabel>
                        <Select
                            isMulti
                            name="colors"
                            value={formData.medicalConditionsOR}
                            styles={customStyles}
                            options={medicalCondition}
                            onChange={(e) => onChangeMedicalCondition(e, constants.Logic.OR)}
                            classNamePrefix="select"
                        />
                    </FormGroup>
                </div>

                <FormGroup className="">
                    <FormLabel component="legend">Select Focus Labels</FormLabel>
                    <Select
                        isMulti
                        name="selectLabels"
                        value={medicalConditionsSelected}
                        styles={customStyles}
                        options={treatment}
                        onChange={onChangeMedicalConditionsSelected}
                        classNamePrefix="select"
                    />
                </FormGroup>

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

        </div>
    )
}

export default PatientFinder;
