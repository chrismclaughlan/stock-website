import DBModify from './DBModify'

class DBPartAdd extends DBModify { 

  constructor(props) {
      super(props)
  }

  doExecute(e) {
    e.preventDefault()
    this.execute('/api/parts/add')
  }

  componentDidMount() {
    super.componentDidMount();
  }

  render() {
    return super.render('Add Part');
  }
}

export default DBPartAdd;