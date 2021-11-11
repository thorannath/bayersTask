import React from 'react'
import { Route, Redirect } from "react-router-dom";
import PatientFinder from '../PatientFinder/PatientFinder';
import Header from '../Header/Header';
import Introduction from '../Introduction/Introduction';
import UserHistory from '../UserHistory/UserHistory';
import './Layout.css';
import Cookies from 'js-cookie';
import * as constants from '../../Constant';
import PopulationOverview from '../PopulationOverview/PopulationOverview';


const Layout = (props) => {
    if (Cookies.get('userid', { path: '/' })) { /* Later: use auth-token and perform authentication from backend*/
        return (
            <div className="box">
                <Header/>
                <div className="content">
                    <Route path={constants.routes.Patient_Finder} component={PatientFinder} ></Route>
                    <Route path={constants.routes.Introduction} component={Introduction}></Route>
                    <Route path={constants.routes.Population_Overview} component={PopulationOverview}></Route>
                    <Route path="/app/preference" component={UserHistory}></Route>
                </div>
            </div>
        )
    } else {
        return <Redirect to="/login" />;
    }
}

export default Layout
