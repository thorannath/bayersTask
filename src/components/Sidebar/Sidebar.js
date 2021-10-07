import { Button, Link } from '@mui/material';
import React from 'react'
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { useHistory } from "react-router-dom";

import './Sidebar.css';

export const structure = [
    { id: 0, label: "Introduction", link: "/app/introduction", icon: null },
    { id: 1, label: "Patient Finder", link: "/app/patient-finder", icon: null }
]


const Sidebar = (props) => {
    const history = useHistory();
    const handleRoute = (label) =>{
        let route = structure.find(val=> val.label === label);
        if(route) history.push(route.link);
    }

    return (
        <div className="sidebar">
            <MenuList className="menu-list">
                <MenuItem className="menu-item" onClick={()=>handleRoute('Introduction')}>
                    <ListItemText disableTypography className="list-item-text">
                        Introduction
                    </ListItemText>
                </MenuItem>
                <MenuItem className="menu-item">
                    <ListItemText disableTypography className="list-item-text">Home</ListItemText>
                </MenuItem>
                <MenuItem className="menu-item">
                    <ListItemText disableTypography className="list-item-text" onClick={()=>handleRoute('Patient Finder')}>Patient Finder</ListItemText>
                </MenuItem>
                <MenuItem className="menu-item">
                    <ListItemText disableTypography className="list-item-text">Dashboard</ListItemText>
                </MenuItem>

            </MenuList>
        </div>
    )
}

export default Sidebar
