import { Button, TextField } from '@mui/material';
import './Authentication.css';
import Form from 'react-bootstrap/Form';
import { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";

export default class Login extends Component {

    constructor(){
        super();
        this.state = {
            username: '',
            password:'',
            redirect:null
        }
    }

    componentDidMount(){
        this.setState({redirect:null});
    }

    handleFormSubmit() {
        if(this.state.username && this.state.password){
            axios.post('http://localhost:3000/login', this.state)
            .then((res)=> {
                console.log(res);
                if(res.success){
                    this.setState({redirect:"/dashboard"});
                }
                else{
                    console.log(res.message);
                }
            })
        }
    }

    render(){
        // if(this.state.redirect){
        //     return <Redirect to={this.state.redirect} />
        // }

        return (
            <div>
                <h1> Login </h1>
                <Form onSubmit={this.handleFormSubmit}>
                    <Form.Group className="form-group" controlId="username">
                        <TextField id="outlined-basic" className="form-input" label="Username" variant="outlined" onChange= {(e)=> this.setState({username: e.target.value})} required />
                    </Form.Group>
                    <Form.Group className="form-group" controlId="password">
                        <TextField
                            id="outlined-password-input"
                            label="Password"
                            className="form-input"
                            type="password"
                            autoComplete="current-password"
                            onChange= {(e)=> this.setState({password: e.target.value})}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" variant="contained">Login</Button>
                </Form>
            </div>
        )
    }
}
