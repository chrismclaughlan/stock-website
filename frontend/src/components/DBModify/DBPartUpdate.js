import DBModify from './DBModify'

class DBPartUpdate extends DBModify { 

  constructor(props) {
      super(props)
  }

  doExecute(e) {
    e.preventDefault()
    this.execute('/api/parts/update')
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentDidUpdate(prevProps, prevState) {
    const {partName, partQuantity, partBookcase, partShelf} = this.props

    if (prevProps.partName === this.props.partName) {
        return;
    }

    this.setState({
        partName, partQuantity, partBookcase, partShelf
    })
  }

  render() {
    return super.render('Update Part');
  }
}

export default DBPartUpdate;