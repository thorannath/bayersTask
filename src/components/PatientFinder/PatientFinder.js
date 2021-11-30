import './PatientFinder.css';
import axios from 'axios'
import React, { useState, useEffect, useCallback } from 'react';
import * as constants from '../../Constant';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLabels, getPreferences } from '../../store/utils/thunkCreators';
import SidebarFilters from './SidebarFilters';
import Cookies from 'js-cookie';
import GeoChart from '../Charts/GeoChart';
import data from "../../US_geo.json";
import Patients from './Patients';
import MultipleSelect from '../Inputs/MultipleSelect';
import Graph from '../Charts/Graph';
import { setLoadingStatus } from '../../store/loader';
import eventBus from '../../services/EventBus';
import UpdateChartNotice from '../Widgets/UpdateChartNotice';

const PatientFinder = () => {
    const dispatch = useDispatch();
    const colors = constants.colors;

    const treatments = useSelector(state => state.labels.treatments);
    const medicalConditions = useSelector(state => state.labels.medicalConditions);
    const preferences = useSelector(state => state.preferences.preferences);
    const treatment = useSelector(state => state.labels.treatments).map(data => ({ value: data.label_val, label: data.name }));
    const medicalCondition = useSelector(state => state.labels.medicalConditions).map(data => ({ value: data.label_val, label: data.name }));
    const modalStatus = useSelector(state => state.modals);

    const [treatmentsSelected, setTreatmentsSelected] = useState(treatment);
    const [medicalConditionsSelected, setMedicalConditionsSelected] = useState(medicalCondition);
    const [graphChange, setGraphChange] = useState(0);
    const [treatmentsChartData, setTreatmentsChartData] = useState({});
    const [medicalChartData, setMedicalChartData] = useState({});
    const [stateData, setStateData] = useState({});

    const initialData = {
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

    useEffect(() => {
        dispatch(fetchLabels())
        dispatch(getPreferences());
    }, [dispatch])

    useEffect(() => {
        fetchGraphData();
    }, [graphChange])

    useEffect(() => {
        if (modalStatus.messageType === constants.MESSAGE_TYPES.VIEW_PREFERECNE) {
            if (modalStatus.action === 'close' && modalStatus.data?.id) {
                const obj = loadPreferenceForm(modalStatus.data.id);
                if (obj) setFormData({ ...obj });
            }
        }
    }, [modalStatus])

    const [formData, setFormData] = useState({ ...initialData });

    const loadPreferenceForm = useCallback((id) => {
        let preference = preferences.find(data => data.id === id);
        if (!preference) return null;

        let jsonData = preference.jsonData;
        const data = {
            preferenceId: preference.id,
            preferenceName: preference.saveName,
            groupBy: jsonData.group_condition.group_by,
            states: jsonData.states.map(data => { return { value: data, label: constants.AcronymToStateNames[data] } }),
            cohorts: { ckd: false, diab: false, both: false },
            payType: { MCR: false, COM: false },
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

    const fetchGraphData = () => {
        const request = requestObject();
        if (!request) return;
        dispatch(setLoadingStatus(true));
        setTimeout(async () => {
            await Promise.all([
                getTreatmentsData(request),
                getMedicalData(request),
                getStatsData(request),
            ])
            dispatch(setLoadingStatus(false));
        }, 1500)
    }

    const getTreatmentsData = async (request) => {
        try {
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
        }
        catch (error) {
            eventBus.dispatch("treatmentsGraphError", { message: "Unable to retrive the Treatments chart data" });
        }
    }

    const getMedicalData = async (request) => {
        try {
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
        catch (error) {
            eventBus.dispatch("medicalGraphError", { message: "Unable to retrive the Medical Chart data" });
        }
    }

    const getStatsData = async (request) => {
        try {
            const populationData = await axios.post('http://localhost:3000/patientfinder/states/population', request);
            setStateData(populationData.data);
        }
        catch (error) {
            eventBus.dispatch("statesGraphError", { message: "Unable to retrive the States map data" });
        }
    }

    const createChartData = (obj) => {
        const chart = { labels: obj.labels, datasets: [] }
        obj.data.map((val, index) => {
            chart.datasets.push({
                label: val.type,
                backgroundColor: colors[index],
                data: val.data
            });
        })
        return chart;
    }

    const requestObject = () => {
        if (formData.states.length == 0) return;
        const groupKeys = (formData.groupBy === constants.groupType.Cohort) ? formData.cohorts : formData.payType;
        const treatmentLabels = treatmentsSelected.map(data => {
            let treatment = treatments.find(val => val.label_val == data.value);
            return treatment?.label;
        });
        const medicalConditionLabels = medicalConditionsSelected.map((data) => {
            let medicalCondition = medicalConditions.find(val => val.label_val == data.value);
            return medicalCondition?.label;
        });

        return {
            userid: Cookies.get("userid", { path: '/' }),
            authToken: Cookies.get('authToken', { path: '/' }),
            jsonData: {
                group_condition: {
                    group_by: formData.groupBy,
                    selection: Object.keys(groupKeys).filter((e, i) => { return groupKeys[e] })
                },
                states: formData.states.map((e) => e['value']),
                treatments: {
                    labels: treatmentLabels,
                    OR: formData.treatmentsOR ? formData.treatmentsOR.map(data => data.value) : null,
                    AND: formData.treatmentsAND ? formData.treatmentsAND.map(data => data.value) : null,
                },
                medical_conditions: {
                    labels: medicalConditionLabels,
                    OR: formData.medicalConditionsOR ? formData.medicalConditionsOR.map(data => data.value) : null,
                    AND: formData.medicalConditionsAND ? formData.medicalConditionsAND.map(data => data.value) : null,
                }
            }
        }
    }

    const handlePreferenceChange = useCallback((event) => {
        const data = loadPreferenceForm(event);
        if (data) setFormData({ ...data });
    }, [loadPreferenceForm]);


    const takeScreenshot = () => {
 
    };

    const onChangeTreatmentSelected = (event) => {
        let res = event.map(data => data.value);
        let treatments = treatment.filter(data => res.includes(data.value));
        setTreatmentsSelected([...treatments]);
        setGraphChange(graphChange + 1);
    }

    const onChangeMedicalConditionsSelected = (event) => {
        let res = event.map(data => data.value);
        let medicalConditions = medicalCondition.filter(data => res.includes(data.value));
        setMedicalConditionsSelected([...medicalConditions]);
        setGraphChange(graphChange + 1);
    }

    const onChangeFormData = (data) => {
        setFormData({ ...data });
        eventBus.dispatch("updateChartNotice", {status: true});
    }

    const onChangeGraphData = (data) => {
        setFormData({ ...data });
        setGraphChange(graphChange + 1)
    }

    const TreatmentsChartComponent = () => (
        <div id="treatment-chart">
            <h3> Treatment Chart </h3>
            <div style={styles.infoBox}>
                This figure displays the prevalence of specific medical conditions among the target patients. Please hover your cursor above the figure to view numeric values of results in the corresponding pop-up window. In the legend, click to select or unselect specific subgroups from display. Below the figure, select or unselect specific medical conditions to customize the display. Display groups can be presented by cohort (default) or by payor type.
            </div>
            <Graph chartData={treatmentsChartData} name="treatment"/>
        </div>
    );

    const MedicalChartComponent = () => (
        <div id="medical-chart" style={styles.section}>
            <h3> Medical Conditions Chart </h3>
            <div style={styles.infoBox}>
                This figure displays the prevalence of specific medication use among the target patients. Please hover your cursor above the figure to view numeric values of results in the corresponding pop-up window. In the legend, click to select or unselect specific subgroups from display. Below the figure, select or unselect specific medication classes to customize the display. Display groups can be presented by cohort (default) or by payor type.
            </div>
            <Graph chartData={medicalChartData} name="medication"/>
        </div>
    );

    return (
        <div className="container">
            <SidebarFilters
                formData={formData}
                onChangeFormData={onChangeFormData}
                onChangeGraphData={onChangeGraphData}
                onUpdateChart={fetchGraphData}
                onResetChart={() => setFormData({ ...initialData })}
                onChangePreference={(id) => handlePreferenceChange(id)}
                onTakeScreenshot={takeScreenshot} />
            <div className="main">
                <TreatmentsChartComponent />
                <MultipleSelect
                    options={treatment}
                    name="Treatment Labels"
                    label="Select Focus Labels"
                    value={treatmentsSelected}
                    onChange={onChangeTreatmentSelected}
                />

                <MedicalChartComponent />
                <MultipleSelect
                    options={medicalCondition}
                    name="Medical Condtion Labels"
                    label="Select Focus Labels"
                    value={medicalConditionsSelected}
                    onChange={onChangeMedicalConditionsSelected}
                />
                <div style={styles.section}>
                    <h3> Geographical Analysis </h3>
                    <div style={styles.infoBox}>
                        The presented geographical analysis displays the proportion of target patients among adult members in the Optum administrative claims dataset. You can hover your cursor above a specific state to view numeric values in the corresponding pop-up window.
                        Please note that patients in Puerto Rico or Unknown geographical regions are not displayed in this figure.
                    </div>
                    <GeoChart data={Object.assign(data, { stateData: stateData })} />
                </div>

                {/** Patient list in a state */}
                <Patients />

                {/** Update chart notice */}
                <UpdateChartNotice/>
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
    }
}
export default PatientFinder;
