import React from 'react';
import AlertPopup from '../AlertPopup';
import DBPartAddNew from '../DBModify/DBPartAddNew'
import DBPartRemove from '../DBModify/DBPartRemove'

class AdminPanelParts extends React.Component{
  render() {
      return (
          <div className="AdminPanelParts">
            <DBPartAddNew />
            <DBPartRemove />
          </div>
      )
  }
}

export default AdminPanelParts;