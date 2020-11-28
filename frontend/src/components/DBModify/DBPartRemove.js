import DBPartModify from './DBPartModify'

class DBPartRemove extends DBPartModify { 

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