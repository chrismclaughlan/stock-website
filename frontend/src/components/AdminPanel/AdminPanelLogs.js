import React from 'react';
import LogsTable from '../DBTables/LogsTable'

class AdminPanelLogs extends React.Component{

  render() {
      return (
          <div className="AdminPanelLogs">
            <div className="container">
              <LogsTable columnsIgnore={["id", "user_id"]} columnNames={["Brugernavn", "Handling", "Del-Navn", "Del-Antal", "Del-Reol", "Del-Hylde", "Dato"]}/>
            </div>
          </div>
      )
  }
}

export default AdminPanelLogs;