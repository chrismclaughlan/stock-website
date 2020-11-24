import React from 'react';
import {Nav} from 'react-bootstrap';
import AdminPanelUsers from './AdminPanelUsers'
import AdminPanelParts from './AdminPanelParts'
import AdminPanelLogs from './AdminPanelLogs'
import ErrorAlert from '../ErrorAlert'

const tabs = ['Users', 'Parts', 'Logs']

class AdminPanel extends React.Component{

    constructor(props) {
        super(props)

        this.state = {
            tab: tabs[0],
        }
    }

    handleSelectTab = (tb) => {
        this.setState({tab: tb})
    }

  render() {

    if (false) {
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
        case "Users":
            content = <AdminPanelUsers />
            break;
        case "Parts":
            content = <AdminPanelParts />
            break;
        case "Logs":
            content = <AdminPanelLogs />
            break;
        default:
            error = {
                message: `Error loading tab '${this.state.tab}'`,
                variant: "warning",
            }
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
                        tabs.map(function(t){
                            return (
                                <Nav.Link key={t} eventKey={t}>{t}</Nav.Link>
                            )
                        })
                    }
                </Nav>

                <ErrorAlert error={error}/>
            </div>

            <div className="container">
                {content}
            </div>
        </div>
    )
  }
}

export default AdminPanel;