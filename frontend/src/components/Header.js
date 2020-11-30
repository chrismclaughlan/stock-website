
import React from 'react';
import {Navbar, Nav, Dropdown, DropdownButton} from 'react-bootstrap';
import {observer} from 'mobx-react';
import UserStore from '../store/UserStore';

class Header extends React.Component{

  render() {
    return (
        <div className="Header">
          <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand href="/">
              <img
                alt=""
                src="/lbt_200x60.png"
                width="160"
                height="50"
                className="d-inline-block align-top"
              />
            </Navbar.Brand>

            &nbsp;&nbsp;&nbsp;&nbsp; {/* Temp fix for spacing */}

                <Nav className="mr-auto">
                  <Navbar.Brand href="/">Hejm</Navbar.Brand>
                  <Nav.Link href="/mylogs">Logs</Nav.Link>
                  {
                    UserStore.privileges > 0 ?
                      <Nav.Link href="/admin-panel">Admin Panel</Nav.Link>
                      :
                      null
                  }
              </Nav>            
            
                <Navbar.Text>
                  Logged på som: <a href="/account">{UserStore.username}</a>
                </Navbar.Text>

                &nbsp;&nbsp;&nbsp;&nbsp;
                
                <DropdownButton
                  menuAlign="right"
                  title={<span className="navbar-toggler-icon"></span>}
                  id="dropdown-menu-align-right"
                  variant="isvisible"
                >
                  <Dropdown.Item href="/account">Konto</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as="button"  onClick={this.props.onLogout}>Log ud</Dropdown.Item>
                </DropdownButton>

          </Navbar>
        </div>
    );
  }
}

export default observer(Header);