import React from 'react';
import {Alert} from 'react-bootstrap';

class ErrorALert extends React.Component{

  render() {
    const {message, variant} = this.props.error;

    if (message !== undefined && message !== null && message !== '') {
        return (
            <Alert key={1} variant={variant ? variant : 'danger'}>
            {message}.
            <div className="d-flex justify-content-end">
                <Alert.Link href="#">Report problem</Alert.Link>
            </div>
            </Alert>
        )
    } else {
        return null;
    }
  }
}

export default ErrorALert;