import React from 'react';
import UserStore from '../store/UserStore';
import {Form, Col, Button, InputGroup, FormControl, Container} from 'react-bootstrap'
import AlertPopup from './AlertPopup'


class LoginForm extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            buttonDisabled: false,
            error: {
                message: '',
                variant: '',
            }
        }
    }

    setInputValue(property, val) {
        val = val.trim();
        if (val.length > 12) {
            return;
        }
        this.setState({
            [property]: val
        })
    }

    resetForm() {
        this.setState({
            username: '',
            password: '',
            buttonDisabled: false
        })
    }

    async doLogin(e) {
        e.preventDefault()

        if (!this.state.username) {
            return;
        }
        if (!this.state.password) {
            return;
        }

        this.setState({
            buttonDisabled: true
        })

        //console.log(`Trying to login with username=${this.state.username} and password=${this.state.password}`)

        try
        {
            let res = await fetch('/login', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            });

            let result = await res.json();
            if (result && result.success) {
                UserStore.isLoggedIn = true;
                UserStore.username = result.username;
                this.setState({error: {message: '', variant: ''}});
            }
            else if (result && result.success === false)
            {
                this.resetForm();
                this.setState({error: {message: 'Incorrect login details', variant: 'warning'}});
            }

            //console.log(`result=${result} and result.success=${result.success} and UserStore.isLoggedIn=${UserStore.isLoggedIn}`)
        }
        catch(e)
        {
            console.log(e);
            this.resetForm();
            this.setState({error: {message: 'Incorrect login details', variant: 'warning'}});
        }
    }

    render() {
        const isValidated = false

        return (
            <div className="loginForm">
                <AlertPopup error={this.state.error}/>

                    <Form inline noValidate 
                        validated={isValidated} 
                        onSubmit={!this.state.buttonDisabled ? (e) => this.doLogin(e) : null}
                    >
                        <Container fluid>
                            
                        <Form.Row>
                            <div className="titleText">Login to access webpage</div>
                        </Form.Row>
                            <Form.Row 
                                style={{paddingTop: "10px"}}
                                className="justify-content-md-center"
                            >
                                <Form.Control
                                required
                                type="text"
                                className="mb-2 mr-sm-2"
                                placeholder="Username"
                                onChange={(val) => this.setInputValue('username', val.target.value)}
                            />
                                <Form.Control.Feedback type="invalid" tooltip={true}>
                                    Username not found
                                </Form.Control.Feedback>

                                <FormControl 
                                    required
                                    type="password"
                                    className="mb-2 mr-sm-2"
                                    placeholder="Password"
                                    onChange={(val) => this.setInputValue('password', val.target.value)}
                                />
                                <Form.Control.Feedback type="invalid" tooltip={true}>
                                    Password invalid
                                </Form.Control.Feedback>
                                <Button
                                type="submit" 
                                className="AppButton mb-2 mr-sm-2"
                                onClick={!this.state.buttonDisabled ? (e) => this.doLogin(e) : null}
                            >
                                Login
                            </Button>
                        </Form.Row>
                        </Container>
                        
                    </Form>

                {/* <form className="needs-validation">
                        <input
                            className="form-control"
                            id="username"
                            onChange={(val) => this.setInputValue('username', val.target.value)}
                            placeholder="Enter your username"
                            required
                            minLength="3"
                            maxLength="20"
                            type="text"
                            value={this.state.username}
                        />
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter password"
                            required onChange={(val) => this.setInputValue('password', val.target.value)}
                            value={this.state.password}
                        />


                </form> */}

                {/* Log in
                <InputField
                    type='text'
                    placeholder='Username'
                    value={this.state.username ? this.state.username : ''}
                    onChange={(val) => this.setInputValue('username', val)}
                />
                <InputField
                    type='password'
                    placeholder='Password'
                    value={this.state.password ? this.state.password : ''}
                    onChange={(val) => this.setInputValue('password', val)}
                /> */}

            </div>
        );
    }
}

export default LoginForm;
