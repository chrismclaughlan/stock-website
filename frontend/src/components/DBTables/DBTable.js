import React from 'react';
import ErrorAlert from '../ErrorAlert'
import {Table, Form, Container, Col, Button, ButtonGroup} from 'react-bootstrap';
import Loading from '../Loading'
import DBPartUpdate from '../DBModify/DBPartUpdate';

class DBTable extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      query: null,
      entries: null,
      isLoading: false,
      error: {
        message: null,
        variant: null,
      },
      search: '',
      maxSearchLength: 255,
      editColumn: null,
      editRow: null,
      lastRow: null,
    }
  }
  
  query(url) {
    this.setState({error: {message: null, variant: null}})

    fetch(url)
    .then(res => res.json())
    .then(
      (result) => {
        if (result.successful) {
          console.log(result)
          this.setState({
            isLoading: false, 
            entries: result.results,
            query: result.query,
          })
        } else {
          
          let reason;
          if (result.notAuthorised) {
            reason = 'Not authorised'
          } else {
            reason = `Could not find  ${result.query.string}  in database`
          }

          this.setState({
            isLoading: false,
            query: null, 
            error: {
              message: `Query unsuccessful. ${reason}`, 
              variant: "warning",
            },
          });
        }
      },
      (error) => {
        this.setState({
          isLoading: false, 
          query: null, 
          error: {
            message: 'Error trying to query database',
            variant: 'danger',
          }})
      }
    )
  }

  setSearchValue(val) {
    val.trim()
    if (val.length > this.state.maxSearchLength) {
      return;
    }

    this.setState({search: val})
  }

  searchReset(e) {
    e.preventDefault()
    if (this.state.lastRow) {
      this.state.lastRow.setAttribute("style", "");
    }
    this.setState({
      search: '', 
      editRow: null,
      editColumn: null,
      lastRow: null
    })
    this.componentDidMount();
  }

  renderSearchResults() {
    if (!this.state.query || !this.state.query.string || !(this.state.query.string.length > 0) || !this.state.entries || !(this.state.entries.length > 0)) {
      return null
    }
    
    return (
      <Form.Text muted>
        <p>Found {this.state.entries.length} {(this.state.query.similar) ? 'similar' : null} search result(s) for: {this.state.query.string}</p>
      </Form.Text>
    )
  }

  renderSearchBar() {
    let isValidated = false
    let buttonDisabled = false
    return (
      <div className="SearchBar">
        <Form inline noValidate 
        validated={isValidated} 
        onSubmit={!buttonDisabled ? (e) => this.search(e) : null}
        >    
          <Container fluid>
              <Form.Row 
                  className="search-bar"
              >
              <Col xs="auto" lg="8">
              <Form.Control
                required
                type="text"
                placeholder="Search"
                value={this.state.search}
                style={{width: "100%"}}
                onChange={(val) => this.setSearchValue(val.target.value)}
                />
              </Col>
              <Col xs="auto" lg="4">
                <ButtonGroup>
                <Button
                  type="submit" 
                  className="AppButton mb-2 mr-sm-2"
                  onClick={!buttonDisabled ? (e) => this.search(e, false) : null}
                  >
                    Search
                </Button>
                <Button
                  type="submit" 
                  className="AppButton mb-2 mr-sm-2"
                  onClick={!buttonDisabled ? (e) => this.search(e, true) : null}
                  >
                    Search Similar
                </Button>
                <Button
                  type="submit" 
                  className="AppButton mb-2 mr-sm-2"
                  style={{paddingRight: "20px"}}
                  onClick={!buttonDisabled ? (e) => this.searchReset(e) : null}
                  >
                    Reset
                </Button>
                </ButtonGroup>
              </Col>
          </Form.Row>
            {this.renderSearchResults()}
        </Container>
        </Form>
        
        <ErrorAlert error={this.state.error}/>
        {this.state.isLoading ? <Loading message="Loading entries..."/> : null}
      </div>
    )
  }

  renderTableHeadings() {
    const {entries} = this.state
    const showColumns = this.props.showColumns

    if (entries && entries.length > 0 && showColumns && showColumns.length > 0) {
        return (
            <tr>
              {
                  Object.keys(entries[0]).map(function(key, index) {
                        if (showColumns.includes(key)) {
                            return <th key={index}>{key}</th>
                        } else {
                          return null
                        }
                      }
                  )
              }
            </tr>
        )
      } else {
        return null
      }
  }

  setEdit(e, key) {
    if (this.state.lastRow) {
      this.state.lastRow.setAttribute("style", "");
    }

    const index = e.currentTarget.getAttribute('index');
    e.currentTarget.parentElement.setAttribute("style", "background-color: #FFE4B5");
    this.setState({editRow: this.state.entries[index]})
    this.setState({editColumn: key})
    this.setState({lastRow: e.currentTarget.parentElement})
  }

  // Only called if successful
  submitUpdate() {
    if (this.state.lastRow) {
      this.state.lastRow.setAttribute("style", "background-color: #9ACD32");
    }
    this.componentDidMount();
  }

  // TODO 2020-11-22
  renderTableEntries () {
    console.log("renderTableEntries")
    const {entries} = this.state
    const showColumns = this.props.showColumns

    if (entries && showColumns && showColumns.length > 0) {

      let arrEntries = []
      var i
      for (i = 0; i < entries.length; i++) {
        let rows = Object.keys(entries[i]).map((key, idx) => {          
          if (showColumns.includes(key)) {
            return (
              <td index={i} key={idx} onClick={(e) => this.setEdit(e, key)}>
                {entries[i][key]}
              </td>
            )
          } else {
            return null
          }
        }, )
        arrEntries.push(rows)
      }

      let arrEntriesDivided = []
      for (i = 0; i < arrEntries.length; i++) {
        arrEntriesDivided.push(
          <tr key={i}>
            {arrEntries[i]}
          </tr>
        )
      }

      return arrEntriesDivided
    } else {
      return null
    }
  }

  renderEdit() {
    let column = this.state.editColumn
    let row = this.state.editRow

    if (!row || !column) {
      return null
    }

    return (
      <DBPartUpdate 
        partName={row.name} 
        partQuantity={row.quantity}
        partBookcase={row.bookcase}
        partShelf={row.shelf}
        onSubmit={() => this.submitUpdate()}
      />
    )
  }

  renderTable() {
    return (
      <div className="DBTable">
          {this.renderEdit()}

        <Table striped bordered hover>
            <thead>
                {this.renderTableHeadings()}
            </thead>
            <tbody>
                {this.renderTableEntries()}
            </tbody>
        </Table>
        
        {!this.state.entries ? <Loading message="Loading results"/> : null}
      </div>
    )
  }
}

export default DBTable;