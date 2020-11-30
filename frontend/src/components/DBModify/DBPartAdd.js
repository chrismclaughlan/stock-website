import DBPartModify from './DBPartModify'

class DBPartAdd extends DBPartModify { 

  async doExecute(e) {
    e.preventDefault();
    await this.execute('/api/parts/add', 'added');
    this.setState({
      partName: '', partQuantityAdd: '', partQuantitySubtract: '', partBookcase: '', partShelf: '',
    })
  }

  render() {
    const properties = {
      name: {
        disable: false, placeholder: 'Name'
      },
      quantityAdd: {
        disable: false, placeholder: 'Quantity'
      },
      quantitySubtract: {
        disable: true, placeholder: ''
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