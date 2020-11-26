import DBModify from './DBModify'

class DBPartRemove extends DBModify { 

  constructor(props) {
      super(props)
  }

  doExecute(e) {
    e.preventDefault()
    this.execute('/api/parts/remove', 'deleted')
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
        disable: true, placeholder: 'Quantity'
      },
      bookcase: {
        disable: true, placeholder: 'Bookcase'
      },
      shelf: {
        disable: true, placeholder: 'Shelf'
      },
    }
    return super.render('Delete Part', properties);
  }
}

export default DBPartRemove;