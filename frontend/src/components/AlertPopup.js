import React from 'react';
import {Alert} from 'react-bootstrap';

class AlertPopup extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      message: '',
      variant: '',
      hovering: false,
    }
  }

  componentDidUpdate(prevProps){
    if (this.props.error.message === prevProps.error.message) {
      return;
    }

    if (this.props.error.variant) {
      this.setState({message: this.props.error.message, variant: this.props.error.variant.toLowerCase()})
    }
  }

  render() {
    const {message, variant} = this.state;

    if (!message) {
      return null;
    }

    return (
      <div className="ErrorAlert">
        <Alert 
          dismissible
          onClose={() => this.setState({message:'', variant: ''})}
          key={1} 
          variant={variant ? variant : 'danger'}
          style={{marginBottom: "0", paddingTop: "0.3rem"}}
        >
          {message}
        </Alert>
      </div>
    )
  }
}

export default AlertPopup;