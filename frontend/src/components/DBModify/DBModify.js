import React from 'react';

const MAX_SEARCH_LENGTH = 64;

class DBModify extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      entries: null,
      isLoading: false,
      error: {
        message: '',
        variant: '',
      },
      maxSearchLength: MAX_SEARCH_LENGTH,
      textInput: null,
    }
  }

  setProperty(property, e) {
    let val = e.currentTarget.value;
    val.trim()
    if (val.length > this.state.maxSearchLength) {
      return;
    }

    this.setState({[property]: val})
  }
}

export default DBModify;