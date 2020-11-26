import DBPartModify from './DBPartModify'

class DBPartUpdate extends DBPartModify { 

  constructor(props) {
      super(props)
  }

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
      partBookcase, 
      partShelf,
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

    // let arr = ['partQuantity', 'partBookcase', 'partShelf']
    // if (arr.includes(property)) {
    //   if (this.props[property] == val) {
    //     e.currentTarget.setAttribute("style", "");
    //   } else {
    //     e.currentTarget.setAttribute("style", "border: 1px solid red; box-shadow: 0px 0px 2px 2px rgba(255,228,181,0.3);");
    //   }
    // }

    this.setState({[property]: val})
  }

  render() {
    // TODO If admin allow to update bookcase and shelf; otherwise disable them
    const properties = {
      name: {
        disable: true, placeholder: 'Name'
      },
      quantity: {
        disable: false, placeholder: 'Remove'
      },
      bookcase: {
        disable: false, placeholder: 'Bookcase'
      },
      shelf: {
        disable: false, placeholder: 'Shelf'
      },
    }
    return super.render('Update Part', properties);
  }
}

export default DBPartUpdate;