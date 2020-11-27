import React from 'react';
import DBUserChangePassword from './DBModify/DBUserChangePassword'
import UserStore from '../store/UserStore'

class Account extends React.Component{

  render() {
      return (
          <div className="Account">
            <DBUserChangePassword username={UserStore.username}/>
          </div>
      )
  }
}

export default Account;