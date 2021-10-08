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
        Cookies.remove("userid");
        Cookies.remove("password");
        history.push("/");
        console.log("Successfully Logout");
    }

        return (
            <nav className="navbar">
                <h1> React Assignment </h1>
                <div className="menu-icons">
                    <span style={{paddingTop:"9px",paddingRight: "5px"}}>Hello { Cookies.get("userid",{path: "/"}) },</span>
                    <Button onClick={onClickProfile} > <AccountCircleIcon/> </Button>
                    <Button variant="outlined" sx={{border:'1px solid seashell'}} onClick={logout}> Logout </Button>
                </div>
            </nav>
        )
}

export default Header