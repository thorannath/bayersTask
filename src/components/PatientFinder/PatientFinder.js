import React from 'react'
import './PatientFinder.css';
import Graph from './Graph';
import axios from 'axios'
import { useState, useEffect, useCallback } from 'react';
import * as constants from '../../Constant';
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
import { showModal, closeModal } from '../../store/modals';
import Cookies from 'js-cookie';
import GeoChart from './GeoChart';
import data from "../../US_geo.json";
import Patients from './Patients';

// import GeoChart from './'

const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid grey',
        color: state.selectProps.menuColor,
        width: '50%',
    }),
    option: (provided, state) => ({
        ...provided,
        padding: 8,
        fontSize: 'small',
    }),
    control: (control) => ({
        ...control,
        padding: 4,
        fontSize: 'small'
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
    const modalStatus = useSelector(state => state.modals);

    const [stateData, setStateData] = useState({});

    const [property, setProperty] = useState("pop_est");

    useEffect(() => {
        switch (modalStatus.messageType) {
            case constants.MESSAGE_TYPES.CREATE_PREFERENCE:
                if (modalStatus.action === 'open') {
                    setLoadFormData({ ...initialData });
                    setOpenCreateModal(true)
                }
                else {
                    setOpenCreateModal(false)
                }
                break;
            case constants.MESSAGE_TYPES.VIEW_PREFERECNE:
                if (modalStatus.action === 'open') {
                    setOpenViewModal(true)
                }
                else {
                    if (modalStatus.data?.id) {
                        let data = loadPreferenceForm(modalStatus.data.id);
                        setFormData({ ...data });
                    }
                    setOpenViewModal(false)
                }
                break;
            case constants.MESSAGE_TYPES.EDIT_PREFERENCE:
                if (modalStatus.action === 'open') {
                    let data = loadPreferenceForm(modalStatus.data.id);
                    setLoadFormData({ ...data })
                    setOpenCreateModal(true)
                }
                else {
                    setOpenViewModal(false)
                }
                break
        }
    }, [modalStatus])

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
        treatmentSelected: treatment,
        medicalConditionsSelected: medicalCondition,
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


    const handleCloseModal = (res) => {
        if (res.action === 'edit') {
            return dispatch(showModal({ messageType: constants.MESSAGE_TYPES.EDIT_PREFERENCE, action: 'open', data: { id: res.data.id } }));
        }
        else if (res.action === 'view') {
            return dispatch(closeModal({ messageType: constants.MESSAGE_TYPES.VIEW_PREFERECNE, action: 'close', data: { id: res.data.id } }))
        }
        return dispatch(closeModal({ messageType: constants.MESSAGE_TYPES.VIEW_PREFERECNE, action: 'close' }))
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

        if (!request) return;

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


        const populationData = await axios.post('http://localhost:3000/patientfinder/states/population', request);
        const res3 = populationData.data;
        setStateData(res3);
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

        if (formData.states.length == 0) return;
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
        html2canvas(document.getElementById("medical-chart")/*, {
            onclone: document => {
                document.getElementById("image-render-medical").style.visibility = "hidden";
            }
        }*/).then(canvas => {

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPdf("l", "mm", "a4");
            const width = pdf.internal.pageSize.getWidth();
            const height = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, "JPEG", 10, 20, width - 10, height - 20);
            pdf.save(`medical-chart_${new Date().toISOString()}.pdf`);
        })/*.catch(err=>{
            console.log(err);
        });*/

        html2canvas(document.getElementById("treatment-chart")/*, {
            onclone: document => {
                document.getElementById("image-render-treatment").style.visibility = "hidden";
            }
        }*/).then(canvas => {

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPdf("l", "mm", "a4");
            const width = pdf.internal.pageSize.getWidth();
            const height = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, "JPEG", 10, 20, width - 10, height - 20);
            pdf.save(`treatment-chart_${new Date().toISOString()}.pdf`);
        });
    };

    const treatmentsChartComponent = (
        <div id="treatment-chart" style={styles.section}>
            <h3> Treatment Chart </h3>
            <div style={styles.infoBox}>
                This figure displays the prevalence of specific medical conditions among the target patients. Please hover your cursor above the figure to view numeric values of results in the corresponding pop-up window. In the legend, click to select or unselect specific subgroups from display. Below the figure, select or unselect specific medical conditions to customize the display. Display groups can be presented by cohort (default) or by payor type.
            </div>
            <Graph chartData={treatmentsChartData} />
        </div>
    );

    const medicalChartComponent = (
        <div id="medical-chart" style={styles.section}>
            <h3> Medical Conditions Chart </h3>
            <div style={styles.infoBox}>
                This figure displays the prevalence of specific medication use among the target patients. Please hover your cursor above the figure to view numeric values of results in the corresponding pop-up window. In the legend, click to select or unselect specific subgroups from display. Below the figure, select or unselect specific medication classes to customize the display. Display groups can be presented by cohort (default) or by payor type.
            </div>
            <Graph chartData={medicalChartData} />
        </div>
    );

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

    console.log(data);
    return (
        <div className="container">
            <SidebarFilters
                formData={formData}
                onChangeFormData={setFormData}
                onUpdateChart={handleClick}
                onResetChart={handleReset}
                onChangePreference={(id) => handlePreferenceChange(id)}
                onTakeScreenshot={takeScreenshot} />
            <div className="main">
                {treatmentsChartComponent}
                <FormGroup>
                    <FormLabel >Select Focus Labels</FormLabel>
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
                {medicalChartComponent}
                <FormGroup>
                    <FormLabel >Select Focus Labels</FormLabel>
                    <Select
                        isMulti
                        name="selectLabels"
                        value={medicalConditionsSelected}
                        styles={customStyles}
                        options={medicalCondition}
                        onChange={onChangeMedicalConditionsSelected}
                        classNamePrefix="select"
                    />
                </FormGroup>
                <div style={styles.section}>
                    <h3> Geographical Analysis </h3>
                    <div style={styles.infoBox}>
                        The presented geographical analysis displays the proportion of target patients among adult members in the Optum administrative claims dataset. You can hover your cursor above a specific state to view numeric values in the corresponding pop-up window.
                        Please note that patients in Puerto Rico or Unknown geographical regions are not displayed in this figure.
                    </div>
                    <GeoChart data={Object.assign(data,{stateData: stateData})} property={property}/>
                </div>


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

                <Patients />
            </div>
        </div>
    )
}

const styles = {
    infoBox: {
        backgroundColor: 'rgb(183,206,206, 0.5)',
        padding: 12,
        transparency: 0.5,
        borderRadius: 5,
        color: '#2B2118',
        lineHeight: 1.4,
        letterSpacing: 0.2,
        fontSize: '15px'
    },
    section: {
        borderTop: '2px dotted grey',
        marginTop: '20px',
        paddingTop: '20px'
    },
}

export default PatientFinder;
