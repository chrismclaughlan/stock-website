import DBUserModify from './DBUserModify'

class DBUserUpdate extends DBUserModify { 

  doExecute(e) {
    e.preventDefault()

    this.execute('/api/users/update', 'updated')
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentDidUpdate(prevProps, prevState) {
    const {username } = this.props

    if (prevProps.username === username) {
        return;
    }

    this.setState({
      username,
      password: '',
    })
  }

  render() {
    const properties = {
      username: {
        disable: true, placeholder: 'Brugernavn'
      },
      password: {
        disable: false, placeholder: 'Nyt Kodeord'
      },
      privileges: {
        disable: false, placeholder: 'Tiladelser'
      },
    }
    return super.render('Opdater Bruger', properties);
  }
}

export default DBUserUpdate;