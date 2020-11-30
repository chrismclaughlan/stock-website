import React from 'react';
import DBPartAdd from '../DBModify/DBPartAdd'

class AdminPanelParts extends React.Component{
  render() {
      return (
          <div className="AdminPanelParts">
            <DBPartAdd />
          </div>
      )
  }
}

export default AdminPanelParts;