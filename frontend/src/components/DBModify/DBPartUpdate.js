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
        disable: true, placeholder: 'Name'
      },
      quantityAdd: {
        disable: !isAdmin, placeholder: '# To Add'
      },
      quantitySubtract: {
        disable: false, placeholder: '# To Remove'
      },
      bookcase: {
        disable: !isAdmin, placeholder: 'Change Bookcase'
      },
      shelf: {
        disable: !isAdmin, placeholder: 'Change Shelf'
      },
    }
    return super.render('', properties);
  }
}

export default DBPartUpdate;