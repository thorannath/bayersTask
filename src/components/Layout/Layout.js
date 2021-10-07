import React from 'react'
import {Route} from "react-router-dom";
import Dashboard from '../Dashboard/Dashboard';
import Header from '../Header/Header';
import Introduction from '../Introduction/Introduction';
import Sidebar from '../Sidebar/Sidebar';

const Layout = () => {
    return (
        <div>
            <Header />
            <div className="box">
                <Sidebar />
                <div className="content">
                    <Route path="/app/dashboard" component={Dashboard} />
                    <Route path="/app/introduction" component={Introduction} />
                </div>
            </div>
        </div>
    )
}

export default Layout
