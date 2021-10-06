import React from 'react'
import {
    Route,
    Switch,
  } from "react-router-dom";
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

                    <Switch>
                        <Route path="/app/dashboard" component={Dashboard} ></Route>
                        <Route path="/app/introduction" component={Introduction}></Route>
                    </Switch>

                </div>
            </div>
        </div>
    )
}

export default Layout
