import React from 'react';
import {Form, Col, Button} from 'react-bootstrap'
import AlertPopup from '../AlertPopup';
import DBModify from './DBModify';
const utils = require('../../Utils');

const MAX_SEARCH_LENGTH = 64;

class DBUserModify extends DBModify{
  constructor(props) {
    super(props);

    this.state = {
        entries: null,
        isLoading: false,
        error: {
          message: '',
          variant: '',
        },
        username: '',
        password: '',
        privileges: '',
        maxSearchLength: MAX_SEARCH_LENGTH,
    }
  }

  async execute(url, successMessage) {
    this.setState({buttonDisabled: true});

    fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        users: [
          {
            username: this.state.username,
            password: this.state.password,
            privileges: this.state.privileges,
          }
        ]
      }),
    })
    .then(utils.handleFetchError)
    .then(res => res.json())
    .then((result) => {

      if (result && result.success) {
        this.setState({
          error: {
            message: `Successfully ${successMessage} ${this.state.username}`, 
            variant: 'success'
          },
          buttonDisabled: false,
        });
        if (this.props.onSuccess) {
          this.props.onSuccess();
        }
      }
      else if (result && result.success === false)
      {
        this.setState({
          error: {
            message: result.msg, 
            variant: 'warning'
          },
          buttonDisabled: false,
        });
        if (this.props.onFailure) {
          this.props.onFailure();
        }
      }
    })
    .catch((err) => {
      console.log(`Error trying to fetch '${url}': '${err}'`)
      if (this.props.onFailure) {
        this.props.onFailure();
      }
      this.setState({
        error: {
          message: `An Error occured: ${err}`, 
          variant: 'danger'
        },
        buttonDisabled: false,
      })
    })
  }

  componentDidMount() {
    const {username, password} = this.props
    
    this.setState({
        username, password
    })
  }

  setProperty(property, e) {
    let val = e.currentTarget.value;
    if (property !== 'password') {
      val = val.trim();
    }

    if (val.length > this.state.maxSearchLength) {
      return;
    }

    this.setState({[property]: val})
  }

  render(title, properties) {
    let isValidated = false

      return (
        <div className="DBModify">
          <AlertPopup error={this.state.error}/>
          <div className="container">
            <Form
              noValidate 
              validated={isValidated} 
              onSubmit={!this.state.buttonDisabled ? (e) => this.doExecute(e) : null}
            >
              <Form.Label className="FormLabel">{title}</Form.Label>
              <Form.Row>
                <Col xs="auto" lg="5">
                  <Form.Control
                    readOnly={properties.username.disable}
                    placeholder={properties.username.placeholder}
                    value={this.state.username}
                    onChange={(e) => this.setProperty('username', e)}
                  />
                </Col>
                <Col xs="auto" lg="2">
                  <Form.Control 
                    type="password"
                    required={!properties.password.disable}
                    readOnly={properties.password.disable}
                    placeholder={properties.password.placeholder}
                    value={this.state.password}
                    onChange={(e) => this.setProperty('password', e)}
                  />
                </Col>
                <Col xs="auto" lg="2">
                  <Form.Control 
                    required={!properties.privileges.disable}
                    readOnly={properties.privileges.disable}
                    placeholder={properties.privileges.placeholder}
                    value={(this.state.privileges)}
                    onChange={(e) => this.setProperty('privileges', e)}
                  />
                </Col>
                <Col xs="auto" lg="1">
                  <Button 
                    variant="primary" 
                    type="submit"
                    className="AppButton"
                    onClick={!this.state.buttonDisabled ? (e) => this.doExecute(e) : null}
                  >
                    Bekræft
                  </Button>
                </Col>

              </Form.Row>
            </Form>
          </div>
        </div>
      )
  }
}

export default DBUserModify;