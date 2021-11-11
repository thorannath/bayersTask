import React from 'react'
import Histogram from '../Charts/Histogram';
import PieChart from '../Charts/PieChart';
import './PopulationOverview.css';

const PopulationOverview = () => {

    const ageData = {
        "18-34": 30,
        "35-64": 44,
        "65+": 64
    };;
    const raceData = {
        "White": 30,
        "Black": 44,
        "Hispanic": 64,
        "Asian": 20
    };;
    const insuranceData = {
        "OTH": 30,
        "HMO": 44,
        "POS": 64,
        "PPO": 30,
        "EPO": 44,
        "IND": 104
    };


    const getAgeData = () => {
        //Write API here
    }

    const getRaceData = () =>{
        //Write API here
    }

    const getInsuranceData = () =>{
        //Write API here
    }

    return (
        <div style={styles.container}>
            <h2> Population Overview </h2>
            <div style={styles.infoBox}>
                <b>Instructions</b><br/>
                This page provides an overview of the total patient population (N=2,840,880) who met the pre-specified cohort criteria for inclusion in this cross-sectional analysis. The figures below provide a visual depiction of the total patient population by cohort, state, year of birth, race, and payor type. Please hover your cursor above a specific data point to view specific information in the corresponding pop-up window.
            </div>
            <div style={styles.section}>
                <PieChart/>
            </div>
            <div style={styles.section}>
                <Histogram data={ageData} title="Age"/>
                <Histogram data={raceData} title="Race"/>
                <Histogram data={insuranceData} title="Insurance"/>
            </div>
        </div>
    )
}

const styles = {
    container:{
        padding:'50px 20px 20px 20px'
    },
    section:{
        borderTop:'2px dotted grey',
        marginTop:'20px',
        paddingTop:'20px'
    },
    infoBox: {
        backgroundColor: 'rgb(183,206,206, 0.5)',
        padding: 12,
        transparency: 0.5,
        borderRadius: 5,
        color: '#2B2118',
        lineHeight:1.4,
        letterSpacing:0.2,
        fontSize:'15px'
    }
}

export default PopulationOverview
