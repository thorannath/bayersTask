import {Button} from '@mui/material';
import {Link} from 'react-router-dom';
import React from 'react'
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul className="list">
                <li><Link to="/app/introduction"><Button>Introduction</Button></Link></li>
                <li><Link to="/app/home"><Button>Home</Button></Link></li>
                <li><Link to="/app/dashboard"><Button>Patient Finder</Button></Link></li>
                <li><Link to="/app/page2"><Button>Page 2</Button></Link></li>
                <li><Link to="/app/page3"><Button >Page 3</Button></Link></li>
            </ul>
        </div>
    )
}

export default Sidebar
