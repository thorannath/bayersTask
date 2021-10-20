import { Link } from 'react-router-dom';
import React from 'react'
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { useLocation } from 'react-router-dom';
import * as constants from '../../Constant';


import './Sidebar.css';

 
export const structure = [
    { id: 0, label: "Introduction", link: "/app/introduction", icon: null },
    { id: 1, label: "Patient Finder", link: "/app/patient-finder", icon: null }
]


const Sidebar = (props) => {

    /*const history = useHistory();
    const handleRoute = (label) =>{
        let route = structure.find(val=> val.label === label);
        if(route) history.push(route.link);
    }*/

    const location = useLocation();
    const isActive = (route) => {
        if (location.pathname === route) return 'menu-item btn-active';
        return 'menu-item';
    }

    return (
        <div className="sidebar">
            <MenuList className="menu-list">

                <Link className="list-link" to="/app/introduction">
                    <MenuItem className="menu-item" className={isActive(constants.routes.Introduction)}>
                        <ListItemText disableTypography className='list-item-text'>
                            Introduction
                        </ListItemText>
                    </MenuItem>
                </Link>

                <Link className="list-link" to="/app/home">
                    <MenuItem className="menu-item" className={isActive(constants.routes.Home)}>
                        <ListItemText disableTypography className='list-item-text'>
                            Home
                        </ListItemText>
                    </MenuItem>
                </Link>

                <Link className="list-link" to="/app/patient-finder">
                    <MenuItem className={isActive(constants.routes.Patient_Finder)}>
                        <ListItemText disableTypography className='list-item-text'>
                            Patient Finder
                        </ListItemText>
                    </MenuItem>
                </Link>

                <Link className="list-link" to="/app/dashboard">
                    <MenuItem className={isActive(constants.routes.Dashboard)}>
                        <ListItemText disableTypography className='list-item-text'>
                            Dashboard
                        </ListItemText>
                    </MenuItem>
                </Link>
            </MenuList>
        </div>
    )
}

export default Sidebar
