import React from 'react';
import {Form, Col, Button} from 'react-bootstrap'
import AlertPopup from '../AlertPopup';
import DBModify from './DBModify'
const utils = require('../../Utils');

const MAX_SEARCH_LENGTH = 64;

class DBPartModify extends DBModify{
  constructor(props) {
    super(props);

    this.state = {
      entries: null,
      isLoading: false,
      error: {
        message: '',
        variant: '',
      },
      partName: '',
      partQuantityAdd: '',
      partQuantitySubtract: '',
      partBookcase: '',
      partShelf: '',
      maxSearchLength: MAX_SEARCH_LENGTH,
      textInput: null,

      buttonDisabled: false,
    }
  }

  async execute(url, successMessage) {
    this.setState({buttonDisabled: true});

    let quantity;
    if (! this.state.partQuantityAdd && !this.state.partQuantitySubtract) {
      quantity = undefined;
    } else {
      let qAdd, qSub;

      if (this.state.partQuantityAdd) {
        qAdd = parseInt(this.state.partQuantityAdd, 10);
        if (isNaN(qAdd)) {
          this.setState({error: {message: `Invalid quantity to add`, variant: 'warning'},buttonDisabled: false,})
          return;
        }
      }

      if (this.state.partQuantitySubtract) {
        qSub = parseInt(this.state.partQuantitySubtract, 10);
        if (isNaN(qSub)) {
          this.setState({error: {message: `Invalid quantity to subtract`, variant: 'warning'},buttonDisabled: false,})
          return;
        }
      }

      quantity = (isNaN(qAdd) ? 0 : Math.abs(qAdd)) - (isNaN(qSub) ? 0 : Math.abs(qSub));
    }

    fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parts: [
          {
            name: this.state.partName,
            quantity,
            bookcase: this.state.partBookcase,
            shelf: this.state.partShelf,
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
            message: `Successfully ${successMessage} ${this.state.partName}`, 
            variant: 'success'
          },
          buttonDisabled: false,
          
          // Reset quantity when sucessful
          partQuantityAdd: '',
          partQuantitySubtract: '',
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
    const {partName} = this.props
    
    this.setState({
        partName
    })

    this.textInput.focus();
  }

  // {name: {disable: false, placeholder: 'Name'}, quantity: {disable: true, placeholder: 'Take'}}
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
                <Col xs="auto" lg="3">
                  <Form.Control
                    readOnly={properties.name.disable}
                    placeholder={properties.name.placeholder}
                    value={this.state.partName}
                    onChange={(e) => this.setProperty('partName', e)}
                  />
                </Col>
                  {
                    (properties.quantityAdd.disable) ? 
                    null 
                    :
                    <Col xs="auto" lg="2">
                    <Form.Control 
                      readOnly={this.state.partQuantitySubtract !== '' ? true : false}
                      placeholder={properties.quantityAdd.placeholder}
                      value={(this.state.partQuantityAdd)}
                      onChange={(e) => this.setProperty('partQuantityAdd', e)}
                      ref={elem => (this.textInput = elem)}
                    />
                  </Col>
                  }
                  {
                  (properties.quantitySubtract.disable) ? 
                  null 
                  :
                  <Col xs="auto" lg={2 + (properties.quantityAdd.disable ? 2 : 0) + (properties.bookcase.disable ? 2 : 0) + (properties.shelf.disable ? 2 : 0)}>
                    <Form.Control 
                      readOnly={this.state.partQuantityAdd !== '' ? true : false}
                      placeholder={properties.quantitySubtract.placeholder}
                      value={(this.state.partQuantitySubtract)}
                      onChange={(e) => this.setProperty('partQuantitySubtract', e)}
                      ref={elem => (this.textInput = elem)}
                    />
                  </Col>
                  }

                  {
                  (properties.bookcase.disable) ? 
                  null 
                  :
                  <Col xs="auto" lg="2">
 
                      <Form.Control 
                        readOnly={properties.bookcase.disable}
                        placeholder={properties.bookcase.placeholder}
                        value={this.state.partBookcase}
                        onChange={(e) => this.setProperty('partBookcase', e)}
                      />
                  </Col>
                    }

                  {
                    (properties.shelf.disable) ? 
                    null 
                    :
                  <Col xs="auto" lg="2">

                    <Form.Control 
                      readOnly={properties.shelf.disable}
                      placeholder={properties.shelf.placeholder}
                      value={this.state.partShelf}
                      onChange={(e) => this.setProperty('partShelf', e)}
                    />
                  </Col>
                    }
                <Col xs="auto" lg="1">
                  <Button 
                    variant="primary" 
                    type="submit"
                    className="AppButton"
                    onClick={!this.state.buttonDisabled ? (e) => this.doExecute(e) : null}
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

export default DBPartModify;