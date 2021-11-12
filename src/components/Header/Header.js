import './Header.css';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { useHistory } from "react-router-dom";
import Cookies from 'js-cookie';
import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import MenuList from '@mui/material/MenuList';
import ListItemText from '@mui/material/ListItemText';
import { useLocation } from 'react-router-dom';
import * as constants from '../../Constant';
import { Link } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { showModal } from '../../store/modals';
import { useDispatch } from 'react-redux';


const Header = () => {
    const dispatch = useDispatch();

    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = () => {
        /* TODO: (Rahul-Part) call Axios for updating logout in database record belonging to user */
        Cookies.remove("userid");
        Cookies.remove("password");
        history.push("/");
        console.log("Successfully Logout");
    }

    const location = useLocation();
    const isActive = (route) => {
        if (location.pathname === route) return 'menu-item btn-active';
        return 'menu-item';
    }

    const showCreatePreference = () =>{
        dispatch(showModal({messageType:constants.MESSAGE_TYPES.CREATE_PREFERENCE, action:'open'}));
    }

    const showViewPreference = () =>{
        dispatch(showModal({messageType:constants.MESSAGE_TYPES.VIEW_PREFERECNE, action:'open'}));
    }
    

    return (

        <div className="main-nav">
            <nav className="navbar">
                <Link className="title-link" to={constants.routes.Introduction}>
                    CKD Population Navigator
                </Link>
                <div className="menu-icons">
                    <span style={{ display: 'flex', alignItems: 'center', fontSize:14, fontWeight: 'bold', letterSpacing: 1.2 }}>Hello {Cookies.get("userid", { path: "/" })},</span>
                    <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                    </IconButton>
                </div>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem>
                        <Avatar/> Profile
                    </MenuItem>
                    <Divider/>
                    <MenuItem onClick={showCreatePreference}>
                        <ListItemIcon>
                            <AddCircleIcon fontSize="small"/>
                        </ListItemIcon>
                        Create Preference
                    </MenuItem>
                    <MenuItem onClick={showViewPreference}>
                        <ListItemIcon>
                            <BookmarksIcon fontSize="small"/>
                        </ListItemIcon>
                         View Preferences
                    </MenuItem>
                    <Divider/>
                    <MenuItem>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                    </MenuItem>
                    <MenuItem onClick={logout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </nav>
            <nav className="sub-header">
                <MenuList className="menu-list">
                    <Link className="list-link" to={constants.routes.Introduction}>
                        <MenuItem className={isActive(constants.routes.Introduction)}>
                            <ListItemText disableTypography className='list-item-text'>
                                Introduction
                            </ListItemText>
                        </MenuItem>
                    </Link>
                    <Link className="list-link" to={constants.routes.Patient_Finder}>
                        <MenuItem className={isActive(constants.routes.Patient_Finder)}>
                            <ListItemText disableTypography className='list-item-text'>
                                Patient Finder
                            </ListItemText>
                        </MenuItem>
                    </Link>
                    <Link className="list-link" to={constants.routes.Population_Overview}>
                        <MenuItem className={isActive(constants.routes.Population_Overview)}>
                            <ListItemText disableTypography className='list-item-text'>
                                Population Overview
                            </ListItemText>
                        </MenuItem>
                    </Link>
                </MenuList>
            </nav>
        </div>

    )
}

export default Header