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
        disable: false, placeholder: 'Navn'
      },
      quantityAdd: {
        disable: false, placeholder: 'Antal'
      },
      quantitySubtract: {
        disable: true, placeholder: ''
      },
      bookcase: {
        disable: false, placeholder: 'Reol'
      },
      shelf: {
        disable: false, placeholder: 'Hylde'
      },
    }
    return super.render('Tilføj Del', properties);
  }
}

export default DBPartAdd;