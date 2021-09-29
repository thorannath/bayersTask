import { Button } from "@mui/material"
import './Header.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Component } from "react";
import { Redirect } from "react-router-dom";

export default class Header extends Component {

    constructor(){
        super();

        this.state = {
            redirect: null
        }
    }
    componentDidMount(){
        this.setState({redirect:null});
    }


    onClickProfile = () => {
        console.log("Profile");
    }

    logout = () => {
        this.setState({redirect:"/login"})
        console.log("Successfully Logout");
    }

    render(){

        // if(this.state.redirect){
        //     console.log("logogog");
        //     return <Redirect to={this.state.redirect} />
        // }

        return (
            <nav className="navbar">
                <h1> React Assignment </h1>
                <div className="menu-icons">
                    <Button onClick={this.onClickProfile} > <AccountCircleIcon/> </Button>
                    
                    <Button variant="outlined" onClick={this.logout}> Logout </Button>
                </div>
            </nav>
        )
    }
}