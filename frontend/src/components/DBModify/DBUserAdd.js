import DBUserModify from './DBUserModify'

class DBUserAdd extends DBUserModify { 

  async doExecute(e) {
    e.preventDefault()
    await this.execute('/api/users/add', 'added')
    this.setState({
      username: '', password: '', privileges: '',
    })
  }

  componentDidMount() {
    super.componentDidMount();
  }

  render() {
    const properties = {
      username: {
        disable: false, placeholder: 'Brugernvan'
      },
      password: {
        disable: false, placeholder: 'Adgangskode'
      },
      privileges: {
        disable: false, placeholder: 'Tiladelser'
      },
    }
    return super.render('Tilføj Bruger', properties);
  }
}

export default DBUserAdd;