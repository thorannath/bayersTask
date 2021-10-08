import React from 'react'
import Sidebar from '../Sidebar/Sidebar';
import './Dashboard.css';
import Graph from './Graph';
import Filters from './Filters';
import Header from '../Header/Header';
import axios from 'axios'
import { useState, useEffect } from 'react';
import * as constants from '../../Constant';
import JSONdata from './data.json';
import Cookies from 'js-cookie';

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

    const [filterStates, setFilterStates] = useState(states);
    const [selectedTreatmentLabels, setSelectedTreatmentLabels] = useState([]);
    const [selectedMedicalConditionLabels, setSelectedMedicalConditionLabels] = useState([]);
    const [filterTreatmentAND, setFilterTreatmentAND] = useState(treatment);
    const [filterMedicalConditionAND, setFilterMedicalConditionAND] = useState(medicalCondition);
    const [filterTreatmentOR, setFilterTreatmentOR] = useState([]);
    const [filterMedicalConditionOR, setFilterMedicalConditionOR] = useState([]);

    const fetchGraphData = () => {

        const request = requestObject();
        console.log(request);
        /*
        const treatmentsChart = createChartData(JSONdata.treatments);
        const medicalChart = createChartData(JSONdata.medical_conditions)
        setTreatmentsChartData({ ...treatmentsChart });
        setMedicalChartData({ ...medicalChart });
        */

        /* Later: Introduce  Authentication and Posting mechanism*/
        request.userid = Cookies.get("userid", {path: '/'});
        console.log(Cookies.get("userid", {path: '/'}));

        axios.post('http://localhost:5000/view-treatment', request)
            .then((response) => {
                const res = response.data;
                res.treatments.labels.shift();
                res.treatments.data = res.treatments.data.map((e,i)=>{
                    const ALL_DATA = e.data.shift();
                    const result = e.data.map((ele,i)=>(ele/ALL_DATA * 100));
                    return {type: e.type, data: result};
                });

                const treatmentsChart = createChartData(res.treatments);
                //const medicalChart = createChartData(res.data.medical_conditions)

                setTreatmentsChartData({ ...treatmentsChart });
                //setMedicalChartData({...medicalChart});
                axios.post('http://localhost:5000/view-medical', request)
                    .then((response) => {
                        const res = response.data;
                        res.medical_conditions.labels.shift();
                        res.medical_conditions.data = res.medical_conditions.data.map((e,i)=>{
                            const ALL_DATA = e.data.shift();
                            const result = e.data.map((ele,i)=>(ele/ALL_DATA * 100));
                            return {type: e.type, data: result};
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
        </div>
    )
}

export default Dashboard
