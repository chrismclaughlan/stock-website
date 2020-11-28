import React from 'react';
import DBTable from './DBTable'
import DBUserUpdate from '../DBModify/DBUserUpdate'

const QUERY_ALL = '/api/users';
const QUERY_STRING = 'username=';
const QUERY_SIMILAR = 'similar=';

class UsersTable extends DBTable{

  search(similar) {
    super.searchAPI(similar, QUERY_ALL, QUERY_STRING, QUERY_SIMILAR);
  }

  async callRemove() {
    const url = '/api/users/remove';
    const data = {
      users: [
        {username: this.state.nameToDelete, },
      ]
    };
    super.callRemove(url, data);
  }

  renderEdit() {
    let column = this.state.editColumn
    let row = this.state.editRow

    if (!row || !column) {
      return null
    }

    return (
      <DBUserUpdate 
        username={row.username}
        onSuccess={() => this.onUpdateSuccess()}
        onFailure={() => this.onUpdateFailure()}
      />
    )
  }

  renderHelpText() {
    return (
      <ul>
        {this.renderHelpTextSearch()}

        <br></br>

        Update:
        <li>password: Enter new password for user</li>

        <br></br>

        Table:
        <li>Delete: Clicking delete will remove this user from the database entirely</li>
      </ul>
    )
  }

  render() {
    return (
      <div className="UsersTable">
        {this.renderSearchBar('Search Usernames')}
        {this.renderEdit()}
        {this.renderTable()}
      </div>
    )
  }
}

export default UsersTable;