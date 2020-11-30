import React from 'react';
import DBTable from './DBTable'
const utils = require('../../Utils');

const QUERY_ALL = '/api/mylogs';

class MyLogsTable extends DBTable{

  search() {
    this.query(QUERY_ALL);
  }

  callRemove() {
    alert("no");
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
      <div className="MyLogsTable">
        <h1 className="display-4">My Logs</h1>
        {this.renderTable()}
      </div>
    );
  }
}

export default MyLogsTable;