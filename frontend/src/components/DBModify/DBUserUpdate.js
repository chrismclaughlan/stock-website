import DBUserModify from './DBUserModify'

class DBUserUpdate extends DBUserModify { 

  constructor(props) {
      super(props)
  }

  doExecute(e) {
    e.preventDefault()

    this.execute('/api/users/update', 'updated')
  }

  componentDidMount() {
    super.componentDidMount();
  }

  render() {
    const properties = {
      username: {
        disable: true, placeholder: 'Username'
      },
      password: {
        disable: false, placeholder: 'Password'
      },
    }
    return super.render('Update User', properties);
  }
}

export default DBUserUpdate;