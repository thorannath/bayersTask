import Sidebar from '../Sidebar/Sidebar';
import './Dashboard.css';
import Graph from './Graph';
import Filters from './Filters';
import Header from '../Header/Header';
import { Component } from 'react';
import axios from 'axios'

export default class Dashboard extends Component {

    constructor(props){
        super(props);
        this.state = {
            patients: [],
            labels: [],
        }
    }

    componentDidMount() {
        this.fetchPatients();
        this.fetchLabels();
    }

    fetchPatients(){
        return axios.get('http://localhost:3000/patients')
            .then((response) => {
                this.setState({
                    patients: response.data.patients
                })
            })
    }

    fetchLabels(){
        return axios.get('http://localhost:3000/labels')
        .then((response)=>{
            this.setState({
                labels: response.data.labels
            })
        })
    }

    render(){
        const {data} = this.state;
        return (
            <div className="container">
                <Header />
                <div className="box">
                    <Sidebar/>
                    <div className="content">
                        <Graph dataParentToChild={data}/>
                        <hr/>
                        <Filters/>
                    </div>
                </div>
            </div>
        )
    }

}