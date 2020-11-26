import React from 'react';
import {observer} from 'mobx-react';
import UserStore from './store/UserStore';
import LoginForm from './components/LoginForm';
import AlertPopup from './components/AlertPopup';
import Loading from './components/Loading'
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css'
import StockTable from './components/DBTables/StockTable';

import Header from './components/Header'
import Footer from './components/Footer'
import MyLogs from './components/MyLogs'
import Account from './components/Account'
import AdminPanel from './components/AdminPanel/AdminPanel'

import {BrowserRouter, Switch, Route} from 'react-router-dom'

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

    try {
      let res = await fetch('/isLoggedIn', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      let result = await res.json();

      if (result && result.success) {
        UserStore.loading = false;
        UserStore.isLoggedIn = true;
        UserStore.username = result.username;
      } else {
        UserStore.loading = false;
        UserStore.isLoggedIn = false;
      }

    } catch (e) {
      console.log(`Error trying to fetch '/isLoggedIn': '${e}'`)
      UserStore.loading = false;
      UserStore.isLoggedIn = false;
      this.setState({connectionError: {message: 'Error checking login status', variant: 'danger'}})
    }
  }

  async doLogout() {

    // Get rid of stock data? is it still there?

    try {
      let res = await fetch('/logout', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        }
      });

      let result = await res.json();

      if (result && result.success) {
        UserStore.isLoggedIn = false;
        UserStore.username = '';
      }
    }
    catch (e) {
      console.log(`Error trying to fetch '/logout': '${e}'`)
      this.setState({connectionError: {message: 'Error trying to logout', variant: 'danger'}})
    }
  }

  render() {
    const {stock, connectionError} = this.state;

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
            username={UserStore.username} 
            onLogout={() => this.doLogout()}
          />

          <Switch>

            <Route exact path="/">
              <div className="container">
                <StockTable showColumns={["name", "quantity", "bookcase", "shelf"]}/>
              </div>
            </Route>

            <Route exact path="/mylogs">
              <MyLogs />
            </Route>

            <Route exact path="/account">
              <Account />
            </Route>

            <Route exact path="/admin-panel">
              <AdminPanel />
            </Route>

          </Switch>

          <Footer />

        </BrowserRouter>
      </div>
    )
  }
}

export default observer(App);
