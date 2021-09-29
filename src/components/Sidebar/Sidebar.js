import { Button } from '@mui/material';
import React from 'react'
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul className="list">
                <li><Button>Home</Button>   </li>
                <li><Button>Page 1</Button>   </li>
                <li><Button>Page 2</Button>   </li>
                <li><Button >Page 3</Button>   </li>
            </ul>
        </div>
    )
}

export default Sidebar
