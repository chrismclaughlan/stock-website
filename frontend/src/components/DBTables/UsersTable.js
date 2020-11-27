import React from 'react';
import DBTable from './DBTable'
import DBUserUpdate from '../DBModify/DBUserUpdate'

const QUERY_ALL = '/api/users';
const QUERY_NAME = 'username=';
const QUERY_SIMILAR = 'similar=';

class UsersTable extends DBTable{
  
  componentDidMount() {
    this.query(QUERY_ALL)
  }

  search(similar) {
    if (similar === undefined) {
      similar = this.state.searchSimilar;
    } else {
      this.setState({
        searchSimilar: similar,
      })
    }

    let searchString = this.state.search;

    searchString = searchString.toLowerCase();

    if (searchString.length === 0) {
      this.query(QUERY_ALL)
    } else if (similar) {
      this.query(`${QUERY_ALL}?${QUERY_NAME + searchString}&${QUERY_SIMILAR + 'true'}`)
    } else {
      this.query(`${QUERY_ALL}?${QUERY_NAME + searchString}`)
    }
  }

  searchExact(e, similar) {
    e.preventDefault();
    this.resetLastRowStyle();
    this.search();
  };

  async callRemove() {
    const username = this.state.nameToDelete;
    if (!username) {
      console.log('no name to delete')
      return;
    }

    try {

      let res = await fetch('/api/users/remove', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({users: [{
            username,
        }]}
        )
      });

      let result = await res.json();
      if (result && result.success) {
        this.setState({error: {message: `Successfully deleted ${username}`, variant: 'success'}});
        this.componentDidMount();
      }
      else if (result && result.success === false)
      {
        this.setState({error: {message: `Failed to deltete ${username}`, variant: 'warning'}});
      }

    } catch(e) {
      this.setState({error: {message: `Error delteting ${username}`, variant: 'danger'}});
    }
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

  render() {
    return (
      <div className="UsersTable">
        {this.renderSearchBar()}
        {this.renderEdit()}
        {this.renderTable()}
      </div>
    )
  }
}

export default UsersTable;