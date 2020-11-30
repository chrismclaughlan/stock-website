import DBPartModify from './DBPartModify'
import UserStore from '../../store/UserStore'

class DBPartUpdate extends DBPartModify { 

  async doExecute(e) {
    e.preventDefault()
    await this.execute('/api/parts/update', 'updated');
  }

  componentDidMount() {
    //super.componentDidMount();

    const {partName, partQuantity, partBookcase, partShelf} = this.props
    this.setState({
      partName, 
      //partQuantity, 
      //partBookcase, 
      //partShelf,
    })
  
    this.textInput.focus();
  }

  componentDidUpdate(prevProps, prevState) {
    const {partName} = this.props

    if (prevProps.partName === partName) {
        return;
    }

    this.setState({
        partName, 
        partQuantityAdd: '',
        partQuantitySubtract: '',
        partBookcase: '', 
        partShelf: '',
    })

    this.textInput.focus();
  }

  render() {
    const isAdmin = (UserStore.privileges > 0);
    const properties = {
      name: {
        disable: true, placeholder: 'Navn'
      },
      quantityAdd: {
        disable: !isAdmin, placeholder: 'Mængde at tilføje'
      },
      quantitySubtract: {
        disable: false, placeholder: 'Mængde taget'
      },
      bookcase: {
        disable: !isAdmin, placeholder: 'Ændre Reol'
      },
      shelf: {
        disable: !isAdmin, placeholder: 'Ændre Hylde'
      },
    }
    return super.render('', properties);
  }
}

export default DBPartUpdate;