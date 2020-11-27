import React from 'react';
import UsersTable from '../DBTables/UsersTable'
import DBUserAdd from './../DBModify/DBUserAdd'
import {Nav, NavDropdown, Button} from 'react-bootstrap';

const pages = ['Create New User']

class AdminPanelUsers extends React.Component{

  constructor(props) {
    super(props)

    this.state = {
      page: 'Existing Users',
    }
  }

  goBack() {
    this.setState({page: 'Existing Users'});
  }

  render() {
    let button;
    let content;

    button = <Button className="AppButton" onClick={() => this.goBack()}>Back</Button>;

    switch(this.state.page) {
      case 'Existing Users':
        button = <Button className="AppButton" onClick={() => this.setState({page: 'Create New User'})}>Create New User</Button>
        content = <UsersTable showColumns={["username"]}/>;
        break;
      case 'Create New User':
        content = <DBUserAdd />;
        break;
      default:
        content = <p>Page does not exist</p>;
        break;
    }

    return (
        <div className="AdminPanelUsers">
          {button}
          {content}
        </div>
    )
  }
}

export default AdminPanelUsers;