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

{/* <Col xs="auto" lg="2">
<Form.Check
  type="checkbox"
  id="autoSizingCheck"
  className="mb-2"
  label="Make Admin"
/>
</Col> */}

export default AdminPanelUsers;