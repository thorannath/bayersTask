import axios from 'axios';
import React from 'react'
import Histogram from '../Charts/Histogram';
import PieChart from '../Charts/PieChart';
import './PopulationOverview.css';

const baseURL = "http://localhost:3000";
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


class PopulationOverview extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
        
        setTimeout(async () => {
            const data = {... (await axios.get(baseURL + "/population/overview")).data};
            if(data.status===200) {
                const ageData = {}, raceData = {};
                data.ageData.map(e=>ageData[e["group"]]=e["count"]);
                data.raceData.map(e=>raceData[ ({'W':'White','B':'Black','0':'Other','H':'Hipsanic','A':'Asian'}[e["race"]])]=e["count"]);
                console.log()
                this.setState({
                    ageData,
                    raceData,
                    isLoaded: true
                })
            };
        }, 1000);
    }
    render(){
        
        let ageData = {};
        let raceData = {};
        let insuranceData = {
            "OTH": 30,
            "HMO": 44,
            "POS": 64,
            "PPO": 30,
            "EPO": 44,
            "IND": 104
        };

        if(this.state.isLoaded){
            ageData = this.state.ageData;
            raceData = this.state.raceData;
        }

        return (
            <div style={styles.container}>
                <h2> Population Overview </h2>
                <div style={styles.infoBox}>
                    <b>Instructions</b><br/>
                    This page provides an overview of the total patient population (N=2,840,880) who met the pre-specified cohort criteria for inclusion in this cross-sectional analysis. The figures below provide a visual depiction of the total patient population by cohort, state, year of birth, race, and payor type. Please hover your cursor above a specific data point to view specific information in the corresponding pop-up window.
                </div>
                <div>
                    <PieChart/>
                </div>
                {
                    (this.state.isLoaded)?(
                        <div style={styles.section}>
                            <Histogram data={ageData} title="Age"/>
                            <Histogram data={raceData} title="Race"/>
                            <Histogram data={insuranceData} title="Insurance"/>
                        </div>
                    ):""
                    
                }
                
            </div>
        )
    }

    
}

export default PopulationOverview
