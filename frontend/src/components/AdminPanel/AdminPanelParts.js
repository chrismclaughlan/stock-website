import React from 'react';
import DBPartAdd from '../DBModify/DBPartAdd'
import DBPartRemove from '../DBModify/DBPartRemove'

class AdminPanelParts extends React.Component{
  render() {
      return (
          <div className="AdminPanelParts">
            <DBPartAdd />
            <DBPartRemove />
          </div>
      )
  }
}

export default AdminPanelParts;