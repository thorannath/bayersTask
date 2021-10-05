import { Button } from "@mui/material"
import './Header.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useHistory } from "react-router-dom";
import Cookies from 'js-cookie';

const Header = () => {
    const history = useHistory();


    const onClickProfile = () => {
        console.log("Profile");
    }

    const logout = () => {
        Cookies.remove("userData");
        history.push("/");
        console.log("Successfully Logout");
    }

        return (
            <nav className="navbar">
                <h1> React Assignment </h1>
                <div className="menu-icons">
                    <Button onClick={onClickProfile} > <AccountCircleIcon/> </Button>
                    
                    <Button variant="outlined" onClick={logout}> Logout </Button>
                </div>
            </nav>
        )
}

export default Header