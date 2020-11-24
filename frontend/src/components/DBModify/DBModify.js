import React from 'react';
import {Form, Col, Button} from 'react-bootstrap'

class DBModify extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      entries: null,
      isLoading: false,
      error: {
        message: null,
        variant: null,
      },
      partName: '',
      partQuantity: '',
      partBookcase: '',
      partShelf: '',
      maxSearchLength: 255,
    }
  }

  async execute(url) {
    try
    {
        let res = await fetch(url, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({parts: [{
                name: this.state.partName,
                quantity: this.state.partQuantity,
                bookcase: this.state.partBookcase,
                shelf: this.state.partShelf,
            }]}
            )
        });

        let result = await res.json();
        if (result && result.success) {
          this.props.onSubmit();  // refresh entries after updating them
        }
        else if (result && result.success === false)
        {
          alert(result.msg);
        }
    }
    catch(e)
    {
        console.log(e);
    }
  }

  componentDidMount() {
    const {partName, partQuantity, partBookcase, partShelf} = this.props
    
    this.setState({
        partName, partQuantity, partBookcase, partShelf
    })
  }

  setProperty(property, val) {
    val.trim()
    if (val.length > this.state.maxSearchLength) {
      return;
    }

    this.setState({[property]: val})
  }

  render(title) {
    let isValidated = false
    let buttonDisabled = false

      return (
        <div className="DBModify">
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
                    placeholder="Name"
                    value={this.state.partName}
                    onChange={(val) => this.setProperty('partName', val.target.value)}
                  />
                </Col>
                <Col xs="auto" lg="2">
                  <Form.Control 
                    placeholder="Quantity"
                    value={this.state.partQuantity}
                    onChange={(val) => this.setProperty('partQuantity', val.target.value)}
                  />
                </Col>
                <Col xs="auto" lg="2">
                  <Form.Control 
                    placeholder="Bookcase"
                    value={this.state.partBookcase}
                    onChange={(val) => this.setProperty('partBookcase', val.target.value)}
                  />
                </Col>
                <Col xs="auto" lg="2">
                  <Form.Control 
                    placeholder="Shelf"
                    value={this.state.partShelf}
                    onChange={(val) => this.setProperty('partShelf', val.target.value)}
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

export default DBModify;