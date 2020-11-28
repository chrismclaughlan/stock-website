import {Form, Col, Button} from 'react-bootstrap'
import DBUserModify from './DBUserModify'
import AlertPopup from '../AlertPopup';

class DBUserChangePassword extends DBUserModify { 

  doExecute(e) {
    e.preventDefault()

    this.execute('/api/users/change-my-password', 'changed')
  }

  componentDidMount() {
    super.componentDidMount();
  }

  render() {
    let isValidated = false
    let buttonDisabled = false
    
    return (
        <div className="DBModify">
          <AlertPopup error={this.state.error}/>
          <div className="container">
            <Form
              noValidate 
              validated={isValidated} 
              onSubmit={!this.state.buttonDisabled ? (e) => this.doExecute(e) : null}
            >
              <Form.Label className="FormLabel">Change Password</Form.Label>
              <Form.Row>
                <Col xs="auto" lg="2">
                  <Form.Control 
                    type="password"
                    placeholder="New Password"
                    value={(this.state.password)}
                    onChange={(e) => this.setProperty('password', e)}
                    ref={elem => (this.textInput = elem)}
                  />
                </Col>
                <Col xs="auto" lg="1">
                  <Button 
                    variant="primary" 
                    type="submit"
                    className="AppButton"
                    onClick={!buttonDisabled ? (e) => this.doExecute(e) : null}
                  >
                    Submit
                  </Button>
                </Col>

              </Form.Row>
            </Form>
          </div>
        </div>
      )
  }
}

export default DBUserChangePassword;