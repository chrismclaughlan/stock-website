import DBPartModify from './DBPartModify'
import UserStore from '../../store/UserStore'

class DBPartUpdate extends DBPartModify { 

  doExecute(e) {
    e.preventDefault()

    // Ensure quantity is negative
    let val = this.state.partQuantity;
    Math.abs(val);
    this.setState({partQuantity: val});

    this.execute('/api/parts/update', 'updated')
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
    const isAdmin = (UserStore.privileges > 0);
    const properties = {
      name: {
        disable: true, placeholder: 'Name'
      },
      quantity: {
        disable: false, placeholder: '# To Remove'
      },
      bookcase: {
        disable: !isAdmin, placeholder: 'Change Bookcase'
      },
      shelf: {
        disable: !isAdmin, placeholder: 'Change Shelf'
      },
    }
    return super.render('Update Part', properties);
  }
}

export default DBPartUpdate;