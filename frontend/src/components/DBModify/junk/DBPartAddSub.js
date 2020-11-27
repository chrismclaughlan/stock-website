import DBModify from '../DBModify'

class DBPartAddSub extends DBModify { 

  constructor(props) {
      super(props)
  }

  doExecute(e) {
    e.preventDefault()
    this.execute('/api/parts/add-sub', 'changed')
  }

  componentDidMount() {
    const {partName, partBookcase, partShelf} = this.props
    
    this.setState({
        partName, partQuantity: '', partBookcase, partShelf
    })

    this.textInput.focus();
  }

  componentDidUpdate(prevProps, prevState) {
    const {partName, partQuantity, partBookcase, partShelf} = this.props

    if (prevProps.partName === partName) {
        return;
    }

    this.setState({
      partName, 
      partQuantity: '', 
      partBookcase, 
      partShelf,
    })

    this.textInput.focus();
  }

  setProperty(property, e) {
    let val = e.currentTarget.value;
    val.trim()
    if (val.length > this.state.maxSearchLength) {
      return;
    }

    this.setState({[property]: val})
  }

  render() {
    return super.render('Add/Sub Part', true, false, true, true);
  }
}

export default DBPartAddSub;