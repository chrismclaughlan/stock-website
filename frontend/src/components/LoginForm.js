import React from 'react';
import UserStore from '../store/UserStore';
import {Form, Button, FormControl, Container} from 'react-bootstrap'
import AlertPopup from './AlertPopup'


class LoginForm extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            buttonDisabled: false,
            usernameIncorrect: false,
            passwordIncorrect: false,
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

    resetForm(error) {
        let errorMsg;
        if (error) {
            errorMsg = {message: 'An error occured', variant: 'danger'};
        } else {
            errorMsg = {message: 'Incorrect login details', variant: 'warning'};
        }

        this.setState({
            // username: '',
            password: '',
            buttonDisabled: false,
            usernameIncorrect: false,
            passwordIncorrect: false,
            error: errorMsg,
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

        this.setState({buttonDisabled: true});

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

            if (!result) {
                this.resetForm(true);
            }

            if (result.success) {
                UserStore.isLoggedIn = true;
                UserStore.username = result.username;
                UserStore.privileges = result.privileges;
                this.setState({error: {message: '', variant: ''}});
                return;
            } else {
                this.resetForm(false);
                this.setState({            
                    usernameIncorrect: result.usernameIncorrect,
                    passwordIncorrect: result.passwordIncorrect,
                })
            }

            //console.log(`result=${result} and result.success=${result.success} and UserStore.isLoggedIn=${UserStore.isLoggedIn}`)
        }
        catch(e)
        {
            console.log(e);
            this.resetForm(true);
        }
    }

    render() {
        return (
            <div className="loginForm">
                <AlertPopup error={this.state.error}/>

                    <Form inline noValidate 
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
                                    isInvalid={this.state.usernameIncorrect}
                                    type="text"
                                    className="mb-2 mr-sm-2"
                                    placeholder="Username"
                                    value={this.state.username}
                                    onChange={(val) => this.setInputValue('username', val.target.value)}
                                />
                                <Form.Control.Feedback type="invalid" tooltip={true}>
                                    Username not found
                                </Form.Control.Feedback>

                                <FormControl 
                                    required
                                    isInvalid={this.state.passwordIncorrect}
                                    type="password"
                                    className="mb-2 mr-sm-2"
                                    placeholder="Password"
                                    value={this.state.password}
                                    onChange={(val) => this.setInputValue('password', val.target.value)}
                                />
                                <Form.Control.Feedback type="invalid" tooltip={true}>
                                    Password invalid
                                </Form.Control.Feedback>
                                <Button
                                type="submit" 
                                className="AppButton mb-2 mr-sm-2"
                            >
                                Login
                            </Button>
                        </Form.Row>
                        </Container>
                    </Form>
            </div>
        );
    }
}

export default LoginForm;
