import React from 'react';

class Footer extends React.Component{

  render() {
    if (!this.props.text) {
      return null
    }

    return (
        <div className="Footer fixed-bottom">
            <i>{this.props.text}</i>
        </div>
    )
  }
}

export default Footer;
