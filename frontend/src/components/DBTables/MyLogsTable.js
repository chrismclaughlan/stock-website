import React from 'react';
import DBTable from './DBTable'

const QUERY_ALL = '/api/mylogs';

class MyLogsTable extends DBTable{

  search() {
    this.query(QUERY_ALL);
  }

  callRemove() {
    alert("no");
  }

  render() {    
    return (
      <div className="MyLogsTable">
        {this.renderTable()}
      </div>
    );
  }
}

export default MyLogsTable;