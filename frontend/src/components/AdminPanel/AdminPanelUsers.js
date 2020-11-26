import React from 'react';
import UsersTable from '../DBTables/UsersTable'

class AdminPanelUsers extends React.Component{

  render() {
      return (
          <div className="AdminPanelUsers">
            <UsersTable showColumns={["username"]}/>
          </div>
      )
  }
}

export default AdminPanelUsers;