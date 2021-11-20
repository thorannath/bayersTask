import React, { useEffect } from 'react'
import { Route } from "react-router-dom";
import PatientFinder from '../PatientFinder/PatientFinder';
import Header from '../Header/Header';
import Introduction from '../Introduction/Introduction';
import UserHistory from '../UserHistory/UserHistory';
import './Layout.css';
import * as constants from '../../Constant';
import PopulationOverview from '../PopulationOverview/PopulationOverview';
import Profile from '../Profile/Profile';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ViewPreferences from '../Preferences/ViewPreferences';
import CreatePreferences from '../Preferences/CreatePreferences';
const Layout = () => {
    const history = useHistory()
    const userStatus = useSelector(state => state.users);

    useEffect(() => {
        if (!userStatus.isLoggedIn) {
            history.push("/login");
            return;
        }
    }, [userStatus]);

    return (
        <div className="box">
            <Header />
            <div className="content">
                <Route path={constants.routes.Patient_Finder} component={PatientFinder} ></Route>
                <Route path={constants.routes.Introduction} component={Introduction}></Route>
                <Route path={constants.routes.Population_Overview} component={PopulationOverview}></Route>
                <Route path={constants.routes.Profile} component={Profile} />
                <Route path="/app/preference" component={UserHistory}></Route>
            </div>

            {/* Create Preference Modal */}
            <CreatePreferences/>

            {/* View Preference Modal */}
            <ViewPreferences/>
        </div>
    )
}

export default Layout
