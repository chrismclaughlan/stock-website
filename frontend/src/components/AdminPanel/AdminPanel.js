import React from 'react';
import {Nav} from 'react-bootstrap';
import AdminPanelUsers from './AdminPanelUsers'
import AdminPanelParts from './AdminPanelParts'
import AdminPanelLogs from './AdminPanelLogs'
import AlertPopup from '../AlertPopup'
import UserStore from '../../store/UserStore'
import {observer} from 'mobx-react';

const tabs = ['Brugere', 'Dele', 'Logs'];

class AdminPanel extends React.Component{

    constructor(props) {
        super(props)

        this.state = {
            tab: tabs[0],
            error: {
                message: '',
                variant: '',
            }
        }
    }

    handleSelectTab = (tb) => {
        this.setState({tab: tb})
    }

  render() {

    if (UserStore.privileges <= 0) {
        return (
            <div className="AdminPanel">
                <p>Not authorised</p>
            </div>
        )
    }

    let content = null
    let error = {
        message: null,
        variant: null,
    }
    switch(this.state.tab)
    {
        case "Brugere":
            content = <AdminPanelUsers />
            break;
        case "Dele":
            content = <AdminPanelParts />
            break;
        case "Logs":
            content = <AdminPanelLogs />
            break;
        default:
            console.log("Error: tab doesn't exist");
            break;
    }

    return (
        <div className="AdminPanel">
            <h1 className="page-title-border display-4">Admin Panel</h1>
            <div className="container" style={{padding: "15px 15px 15px 15px"}}>
                <Nav fill 
                    className="mr-auto justify-content-center container" 
                    variant="tabs" 
                    defaultActiveKey={this.state.tab} 
                    onSelect={(t) => this.handleSelectTab(t)}
                >
                    {
                        tabs.map(function(t) {
                            return (
                                <Nav.Link key={t} eventKey={t}>{t}</Nav.Link>
                            )
                        })
                    }
                </Nav>

                <AlertPopup error={error}/>
            </div>

            <div className="container">
                {content}
            </div>
        </div>
    )
  }
}

export default observer(AdminPanel);