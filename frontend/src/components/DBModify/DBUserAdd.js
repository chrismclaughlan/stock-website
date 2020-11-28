import DBUserModify from './DBUserModify'

class DBUserAdd extends DBUserModify { 

  doExecute(e) {
    e.preventDefault()

    this.execute('/api/users/add', 'added')
  }

  componentDidMount() {
    super.componentDidMount();
  }

  render() {
    const properties = {
      username: {
        disable: false, placeholder: 'Username'
      },
      password: {
        disable: false, placeholder: 'Password'
      },
    }
    return super.render('Add User', properties);
  }
}

export default DBUserAdd;