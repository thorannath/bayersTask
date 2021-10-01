import Sidebar from '../Sidebar/Sidebar';
import './Dashboard.css';
import Graph from './Graph';
import Filters from './Filters';
import Header from '../Header/Header';
import axios from 'axios'
import { useState, useEffect } from 'react';
import * as constants from '../../Constant';


const Dashboard = () => {
    const patientCohort = constants.Patient_Cohort;
    const payerType = constants.Paytype;
    const states = constants.States;
    const colors = constants.colors;

    const [patients, setPatients] = useState([]);
    const [labels, setLabels] = useState([]);
    const [cohort, setCohort] = useState({ ckd: true, diab: true, both: true });
    const [payType, setPayType] = useState({ MCR: true, COM: true })
    const [chartData, setChartData] = useState(null);
    const [filterStates, setFilterStates] = useState(states);
    const [groupBy, setGroupBy] = useState(constants.groupType.Cohort);

    const [treatment, setTreatment] = useState([]);
    const [medicalCondition, setMedicalCondition] = useState([]);
    const [filterTreatment, setFilterTreatment] = useState(treatment);
    const [filterMedicalCondition, setFilterMedicalCondition] = useState(medicalCondition);

    const handleGroupBy = (group) => {
        if (group == constants.groupType.Cohort) {
            setGroupBy(constants.groupType.Cohort);
        }
        else if (group == constants.groupType.PayerType) {
            setGroupBy(constants.groupType.PayerType);
        }
    }

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
        let states = filterStates
        if (event.target.checked) {
            states.push(event.target.name)
        }
        else {
            states = states.filter(data => data != event.target.name);
        }
        setFilterStates([...states]);
    }

    const handleTreatments = (event) => {
        let treatments = filterTreatment;
        if (event.target.checked) {
            treatments.push(event.target.value)
        }
        else {
            treatments = treatments.filter(data => data != event.target.value);
        }
        setFilterTreatment([...treatments]);
    }

    const handleMedicalConditions = (event) => {
        let medicalConditions = filterMedicalCondition;
        if (event.target.checked) {
            medicalConditions.push(event.target.value)
        }
        else {
            medicalConditions = medicalConditions.filter(data => data != event.target.value);
        }
        setFilterMedicalCondition([...medicalConditions]);
    }

    const handleClick = () => {
        let data = {
            labels: getLabels(),
            datasets: []
        };

        if (groupBy == constants.groupType.Cohort) {
            patientCohort.map((val, i) => {
                if (cohort[val]) {
                    data.datasets.push({
                        label: val.toUpperCase(),
                        backgroundColor: colors[i],
                        data: getLableData(val)
                    })
                }
            })
        }
        else if (groupBy == constants.groupType.PayerType) {
            payerType.map((val, i) => {
                if (payType[val]) {
                    data.datasets.push({
                        label: val.toUpperCase(),
                        backgroundColor: colors[i],
                        data: getLableData(val)
                    })
                }
            })
        }
        setChartData({ ...data });
    }

    const getLabels = () => {
        if(filterTreatment.length == 0){
            return filterMedicalCondition.map(data => {
                let value = labels.find(val => (val.label_type == constants.labelTypes.MEDICAL_CONDITION && val.label_val == data));
                if (!!value) return value.name;
            })
        }
        else if(filterMedicalCondition.length == 0){
            return filterTreatment.map(data => {
                let value = labels.find(val => (val.label_type == constants.labelTypes.TREATMENT && val.label_val == data));
                if (!!value) return value.name;
            })
        }
        else{
            let finalLabels = [];
            filterTreatment.map(data => {
                let value = labels.find(val => (val.label_type == constants.labelTypes.TREATMENT && val.label_val == data));
                if (!!value){
                    finalLabels.push(value.name);
                }
            })
            filterMedicalCondition.map(data => {
                let value = labels.find(val => (val.label_type == constants.labelTypes.MEDICAL_CONDITION && val.label_val == data));
                if (!!value){
                    finalLabels.push(value.name);
                }
            })
            return finalLabels;
        }

    }

    const getLableData = (val) => {
        if (groupBy == constants.groupType.Cohort) {
           return patientCount(val, constants.groupBy.POP)
        }
        else if (groupBy == constants.groupType.PayerType) {
           return patientCount(val, constants.groupBy.PAY_TYPE)
        }
    }

    const patientCount = (val, groupBy) => {

        if(filterTreatment.length == 0){
            return filterMedicalCondition.map(data => {
                    return patients.filter(patient => (((patient.medical_condition & data) == data) && (patient[groupBy]==val) && filterStates.includes(patient.state))).length;
            })
        }
        else if(filterMedicalCondition.length == 0){
        //     let treatmentNumber = 0;
        //    filterTreatment.map((val) =>{
        //        treatmentNumber += parseInt(val);
        //    })

            return filterTreatment.map(data => {
                    return patients.filter(patient => (((patient.treatment&data) == data) && (patient[groupBy]==val) && filterStates.includes(patient.state))).length;
            })
        }
        else{
            let finalCount = [];
            let count1 = filterTreatment.map(data => {
                    return patients.filter(patient => (((patient.treatment & data) == data) && (patient[groupBy]==val) && filterStates.includes(patient.state))).length;
            })
            let count2 = filterMedicalCondition.map(data => {
                    return patients.filter(patient => (((patient.medical_condition & data) == data) && (patient[groupBy]==val) && filterStates.includes(patient.state))).length;
            });
            finalCount = [...count1, ...count2];
            return finalCount;
        }

    }

    useEffect(() => {
        fetchData();
        fetchLabels();
    }, [])

    useEffect(() => {
        handleClick();
    }, [patients, labels]);


    const fetchData = () => {
        return axios.get('http://localhost:3000/patients')
            .then((response) => {
                setPatients(response.data.patients)
            })
    }

    const fetchLabels = () => {
        return axios.get('http://localhost:3000/labels')
            .then(res => {
                let labelData = res.data.labels;
                let medicalConditions = labelData.filter(data => data.label_type == constants.labelTypes.MEDICAL_CONDITION);
                let treatments = labelData.filter(data => data.label_type == constants.labelTypes.TREATMENT);
                setLabels(labelData);
                setMedicalCondition([...medicalConditions])
                setTreatment([...treatments])
            })
    }

    return (
        <div className="container">
            <Header />
            <div className="box">
                <Sidebar />
                <div className="content">
                    <Graph chartData={chartData} />
                    <hr />
                    <Filters
                        cohort={cohort}
                        payType={payType}
                        groupBy={groupBy}
                        filterStates={filterStates}
                        treatment={treatment}
                        medicalCondition={medicalCondition}
                        filterTreatment={filterTreatment}
                        filterMedicalCondition={filterMedicalCondition}
                        onClick={handleClick}
                        onChange={handleChange}
                        onChangeGroup={handleGroupBy}
                        onChangeStates={handleStates}
                        onChangeTreatment={handleTreatments}
                        onChangeMedicalCondition={handleMedicalConditions}
                    />
                </div>
            </div>
        </div>
    )
}

export default Dashboard