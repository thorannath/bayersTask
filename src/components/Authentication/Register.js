import React, { Component } from 'react'
import Form from 'react-bootstrap/Form';
import { Button, TextField } from '@mui/material';
import axios from 'axios';


export default class Register extends Component {

    constructor(){
        super();
        
        this.state = {
            username: '',
            email: '',
            fullName: '',
            password: '',
        }
    }

    handleFormSubmit = (e) => {
        if(this.state.username && this.state.password && this.state.fullName && this.state.email){
            axios.post('http://localhost:3000/register', this.state)
            .then((res)=> {
                if(res.success){

                }
                else{
                    console.log(res.message);
                }
            })
        }
    }

    render(){
        return (
            <div>
                <h1> Register </h1>
                <Form onSubmit={this.handleFormSubmit}>
                    <Form.Group className="form-group" controlId="username">
                        <TextField type="text" className="form-input" label="Username" variant="outlined" onChange= {(e)=> this.setState({username: e.target.value})} required />
                    </Form.Group>
    
                    <Form.Group className="form-group" controlId="email">
                        <TextField type="email" className="form-input" label="Email" variant="outlined" onChange= {(e)=> this.setState({email: e.target.value})} required />                    
                    </Form.Group>

                    <Form.Group className="form-group" controlId="fullName">
                        <TextField type="text" className="form-input" label="Full Name" variant="outlined" onChange= {(e)=> this.setState({fullName: e.target.value})} required />                    
                    </Form.Group>
    
                    <Form.Group className="form-group" controlId="password">
                        <TextField
                            label="Password"
                            type="password"
                            className="form-input"
                            autoComplete="current-password"
                            onChange= {(e)=> this.setState({password: e.target.value})}
                            required
                        />                
                    </Form.Group>
                    <Button type="submit" color="secondary" variant="contained">Register</Button>
                </Form>
            </div>
        )
    }
}