import React from 'react';
import LogsTable from '../DBTables/LogsTable'

class AdminPanelLogs extends React.Component{

  render() {
      return (
          <div className="AdminPanelLogs">
            <div className="container">
              <LogsTable showColumns={["id", "user_username", "action", "part_name", "part_quantity", "part_bookcase", "part_shelf", "date"]}/>
            </div>
          </div>
      )
  }
}

export default AdminPanelLogs;