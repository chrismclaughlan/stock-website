import React from 'react';
import DBTable from './DBTable'
const utils = require('../../Utils');

const QUERY_ALL = '/api/logs';
const QUERY_STRING = 'username=';
const QUERY_SIMILAR = 'similar=';

class LogsTable extends DBTable{

  search(similar) {
    super.searchAPI(similar, QUERY_ALL, QUERY_STRING, QUERY_SIMILAR);
  }

  async callRemove() {
    const url = '/api/logs/remove';
    const data = {
      logs: [
        {id: this.state.nameToDelete, },
      ]
    };
    super.callRemove(url, data);
  }

  callRemove() {
    return;
  }

  renderHelpText() {
    return (
      <ul>
        {this.renderHelpTextSearch()}

        <br></br>

        <li>part_quantity: Quantity of parts removed</li>
        <li>part_bookcase: Bookcase changed to <i>some value</i></li>
        <li>part_shelf: Shelf changed to <i>some value</i></li>
      </ul>
    )
  }

  render() {    
    return (
      <div className="LogsTable">
        {this.renderSearchBar("Search Users' usernames")}
        {this.renderTable()}
      </div>
    );
  }
}

export default LogsTable;