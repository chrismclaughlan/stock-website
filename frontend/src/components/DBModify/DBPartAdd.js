import DBModify from './DBModify'

class DBPartAdd extends DBModify { 

  constructor(props) {
      super(props)
  }

  doExecute(e) {
    e.preventDefault()
    this.execute('/api/parts/add', 'added')
  }

  componentDidMount() {
    super.componentDidMount();
  }

  render() {
    const properties = {
      name: {
        disable: false, placeholder: 'Name'
      },
      quantity: {
        disable: false, placeholder: 'Quantity'
      },
      bookcase: {
        disable: false, placeholder: 'Bookcase'
      },
      shelf: {
        disable: false, placeholder: 'Shelf'
      },
    }
    return super.render('Add Part', properties);
  }
}

export default DBPartAdd;