import React from 'react';

class Loading extends React.Component{

  render() {

    let message;

    if (this.props.message !== undefined) {
        message = (
            <p className="spinner-text">{this.props.message}</p>
        );
    } else {
        message = null;
    }

    return (
        <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status"></div>
            {message}
        </div>
    )
  }
}

export default Loading;