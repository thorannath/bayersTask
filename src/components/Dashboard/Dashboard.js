import Sidebar from '../Sidebar/Sidebar';
import './Dashboard.css';
import Graph from './Graph';
import Filters from './Filters';
import Header from '../Header/Header';
import axios from 'axios'
import { useState, useEffect } from 'react';
import * as constants from '../../Constant';


const Dashboard = () => {

    const [patients, setPatients] = useState([]);
    const [labels, setLabels] = useState([]);

    const [cohort, setCohort] = useState({
        ckd: true,
        diab: true,
        both: true
    });

    const [payType, setPayType] = useState({
        MCR: true,
        COM: true
    })


    const [chartData, setChartData] = useState(null);

    const [groupBy, setGroupBy] = useState('cohort');

    const patientCohort = constants.Patient_Cohort;
    const payerType = constants.Paytype;

    const handleGroupBy = (group) =>{
        if(group == 'cohort'){
            setGroupBy('cohort');
        }
        else if(group == 'paytype'){
            setGroupBy('paytype');   
        }
    }


    const handleChange = (event, filterType) => {
        switch(filterType){
            case 'cohort':
                setCohort({
                    ...cohort,
                    [event.target.name]: event.target.checked,
                });
                break;
            
            case 'payType':
                setPayType({
                    ...payType,
                    [event.target.name]: event.target.checked,
                });
                break;
        }
    };

    const handleClick = () => {
        let data = {
            labels: labels.map(res => res.name),
            datasets: []
        };

        if(groupBy == 'cohort'){
            patientCohort.map(val => {
                if (cohort[val]) {
                    data.datasets.push({
                        label: val.toUpperCase(),
                        backgroundColor: 'rgba(80,192,192,1)',
                        data: getLableData(val)
                    })
                }
            })
        }
        else if(groupBy == 'paytype'){
            payerType.map(val => {
                if (payType[val]) {
                    data.datasets.push({
                        label: val.toUpperCase(),
                        backgroundColor: 'rgba(80,192,192,1)',
                        data: getLableData(val)
                    })
                }
            })
        }

        setChartData(data);
    }

    const getLableData = (val) => {
        if(groupBy == 'cohort'){
            return labels.map(label => {
                let final = patients.filter(patient => (patient[label.label] == '1' && patient.pop === val))
                return final.length;
            })
        }
        else{
            return labels.map(label => {
                let final = patients.filter(patient => (patient[label.label] == '1' && patient.paytyp === val))
                return final.length;
            }) 
        }
    }

    useEffect(() => {
        fetchData();
        fetchLabels();
    }, [])

    useEffect(() => {
        setChartData({
            labels: labels.map(res => res.name),
            datasets: [
                {
                    label: 'CKD',
                    backgroundColor: 'rgba(80,192,192,1)',
                    borderColor: 'rgba(0,0,0,1)',
                    data: getLableData('ckd')
                },
                {
                    label: 'DIAB',
                    backgroundColor: 'rgba(75,252,192,1)',
                    borderColor: 'rgba(0,0,0,1)',
                    data: getLableData('diab')
                },
                {
                    label: 'Both',
                    backgroundColor: 'rgba(75,192,192,1)',
                    borderColor: 'rgba(1,0,0,1)',
                    data: getLableData('both')
                }
            ]
        })
    }, [labels, patients]);


    const fetchData = () => {
        return axios.get('http://localhost:3000/patients')
            .then((response) => {
                setPatients(response.data.patients)
            })
    }

    const fetchLabels = () => {
        return axios.get('http://localhost:3000/labels')
            .then(res => {
                setLabels(res.data.labels)
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
                    <Filters cohort={cohort} payType={payType} groupBy={groupBy} onClick={handleClick} onChange={handleChange} onChangeGroup={handleGroupBy} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard