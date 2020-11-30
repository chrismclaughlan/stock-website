import React from 'react';
import {observer} from 'mobx-react';
import UserStore from './store/UserStore';
import LoginForm from './components/LoginForm';
import AlertPopup from './components/AlertPopup';
import Loading from './components/Loading'
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css'
import StockTable from './components/DBTables/StockTable';
import MyLogsTable from './components/DBTables/MyLogsTable'

import Header from './components/Header'
import Account from './components/Account'
import AdminPanel from './components/AdminPanel/AdminPanel'

import {BrowserRouter, Switch, Route} from 'react-router-dom'

const utils = require('./Utils');

class App extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      connectionError: {
        message: null,
        variant: null,
      }
    };
  }

  async componentDidMount() {
    fetch('/isLoggedIn', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(utils.handleFetchError)
    .then(res => res.json())
    .then((result) => {
      if (result && result.success) {
        UserStore.loading = false;
        UserStore.isLoggedIn = true;
        UserStore.username = result.username;
        UserStore.privileges = result.privileges;
      } else {
        UserStore.loading = false;
        UserStore.isLoggedIn = false;
        UserStore.username = '';
        UserStore.privileges = 0;
      }
    })
    .catch((err) => {

      console.log(`Error trying to fetch '/isLoggedIn': '${err}'`)

      UserStore.loading = false;
      UserStore.isLoggedIn = false;
      UserStore.username = '';
      UserStore.privileges = 0;

      this.setState({
        connectionError: {
          message: `Error checking login status: ${err}`, 
          variant: 'danger'
        }
      })
    })
  }

  async doLogout() {
    fetch('/logout', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(utils.handleFetchError)
    .then(res => res.json())
    .then((result) => {
      if (result && result.success) {
        UserStore.isLoggedIn = false;
        UserStore.username = '';
        UserStore.privileges = 0;
      }
    })
    .catch((err) => {
      console.log(`Error trying to fetch '/logout': '${err}'`)
      this.setState({
        connectionError: {
          message: `Error trying to logout: ${err}`, 
          variant: 'danger'
        }
      })
    })
  }

  render() {
    const {connectionError} = this.state;

    if (UserStore.loading) {
      return (
        <div className="App">
          <Loading message="Loading ..."/>
        </div>
      )
    }

    if (!UserStore.isLoggedIn) {
      return (
        <div className="app">
          <div className="container">
            
            <AlertPopup error={connectionError} />

            <div className="center-screen">
              <LoginForm />
            </div>

          </div>
        </div>
      )
    }

    return (
      <div className="App">
        <BrowserRouter>
          <Header
            onLogout={() => this.doLogout()}
          />

          <Switch>

            <Route exact path="/">
              <div className="container">
                <StockTable showColumns={["Delete", "name", "quantity", "bookcase", "shelf"]}/>
              </div>
            </Route>

            <Route exact path="/mylogs">
              <div className="container">
                <MyLogsTable showColumns={["id", "user_username", "action", "part_name", "part_quantity", "part_bookcase", "part_shelf", "date"]}/>
              </div>
            </Route>

            <Route exact path="/account">
              <Account />
            </Route>
            
            <Route exact path="/admin-panel">
              <AdminPanel />
            </Route>

          </Switch>

        </BrowserRouter>
      </div>
    )
  }
}

export default observer(App);
