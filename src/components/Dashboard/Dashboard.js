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
    const [filterStates, setFilterStates ] = useState(states);
    const [groupBy, setGroupBy] = useState(constants.groupType.Cohort);

    const handleGroupBy = (group) =>{
        if(group == constants.groupType.Cohort){
            setGroupBy(constants.groupType.Cohort);
        }
        else if(group == constants.groupType.PayerType){
            setGroupBy(constants.groupType.PayerType);   
        }
    }

    const handleChange = (event, filterType) => {
        switch(filterType){
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
        if(event.target.checked){
          states.push(event.target.name)
        }
        else{
          states = states.filter(data=> data!= event.target.name);
        }
        setFilterStates(states);
    }

    const handleClick = () => {
        let labelsData = labels;

            let data = {
                labels: labelsData.map(res=> res.name),
                datasets: []
            };
            if(groupBy == constants.groupType.Cohort){
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
            else if(groupBy == constants.groupType.PayerType){
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
            setChartData(data);
    }

    const getLableData = (val) => {
        if(groupBy == constants.groupType.Cohort){
            return labels.map(label => { 
                return patients.filter(patient => ( patient[label.label] == '1' && patient.pop === val && filterStates.includes(patient.state))).length/10
            })
        }
        else if(groupBy == constants.groupType.PayerType){
            return labels.map(label => { 
                return patients.filter(patient => (patient[label.label] == '1' && patient.paytyp === val && filterStates.includes(patient.state))).length/10; 
            }) 
        }
    }

    useEffect(() => {
        fetchData();
        fetchLabels();
    }, [])

    useEffect(() => {
        handleClick(patients);
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
                let labelData = res.data.labels.filter(data=> data.label_type ==null);
                setLabels(labelData);
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
                    onClick={handleClick} 
                    onChange={handleChange} 
                    onChangeGroup={handleGroupBy}
                    onChangeStates ={handleStates}
                    />
                </div>
            </div>
        </div>
    )
}

export default Dashboard