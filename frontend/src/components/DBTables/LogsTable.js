import React from 'react';
import DBTable from './DBTable'

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