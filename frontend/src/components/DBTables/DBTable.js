import React from 'react';
import AlertPopup from '../AlertPopup'
import {Table, Form, Container, Col, Button, ButtonGroup, Pagination, Modal} from 'react-bootstrap';
import Loading from '../Loading'
import UserStore from '../../store/UserStore'


const MAX_SEARCH_LENGTH = 255;
const DEFAULT_ENTRIES_PER_PAGE = 15;


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
      searchSimilar: false,
      maxSearchLength: MAX_SEARCH_LENGTH,
      editColumn: null,
      editRow: null,
      lastRow: null,

      page: 0,
      entriesPerPage: DEFAULT_ENTRIES_PER_PAGE,

      nameToDelete: '',
    }
  }
  
  componentDidMount() {
    this.search();
  }

  searchAPI(similar, api_query_all, api_query_string, api_query_similar) {
    if (similar === undefined) {
      similar = this.state.searchSimilar;
    } else {
      this.setState({
        searchSimilar: similar,
      })
    }

    let searchString = this.state.search;
    searchString = searchString.toLowerCase();

    if (searchString.length === 0) {
      this.query(api_query_all)
    } else if (similar) {
      this.query(`${api_query_all}?${api_query_string + searchString}&${api_query_similar + 'true'}`)
    } else {
      this.query(`${api_query_all}?${api_query_string + searchString}`)
    }
  }
  
  searchE(e, similar) {
    e.preventDefault();
    this.resetLastRowStyle();
    this.search(similar);
  };

  async callRemove(url, data) {
    const nameToDelete = this.state.nameToDelete;
    if (!nameToDelete) {
      console.log('no name to delete')
      return;
    }

    try {

      let res = await fetch(url, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      let result = await res.json();
      if (result && result.success) {
        this.setState({error: {message: `Successfully deleted ${nameToDelete}`, variant: 'success'}});
        this.componentDidMount();
      }
      else if (result && result.success === false)
      {
        this.setState({error: {message: `Failed to delete ${nameToDelete}`, variant: 'warning'}});
      }

    } catch(e) {
      this.setState({error: {message: `Error delteting ${nameToDelete}`, variant: 'danger'}});
    }
  }

  query(url) {
    this.setState({error: {message: null, variant: null}})

    fetch(url)
    .then(res => res.json())
    .then(
      (result) => {
        if (result.successful) {
          this.setState({
            isLoading: false, 
            entries: result.results,
            query: result.query,
          })
        } else {
          
          let reason;
          if (result.notAuthorised) {
            reason = 'Not authorised';
          } else if (result.query) {
            reason = `Could not find  ${result.query.string}  in database`;
          } else {
            reason = 'Could not find any entries in database';
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

  renderSearchBar(placeholder) {
    let isValidated = false
    let buttonDisabled = false
    return (
      <div className="SearchBar">
        <Form inline noValidate 
        validated={isValidated} 

        // Default to normal search
        onSubmit={!buttonDisabled ? (e) => this.searchE(e, false) : null}
        >    
          <Container fluid>
                <Form.Row 
                    className="search-bar"
                >
                <Col xs="auto" lg="8">
                <Form.Control
                  required
                  type="text"
                  placeholder={placeholder}
                  value={this.state.search}
                  style={{width: "100%"}}
                  onChange={(val) => this.setSearchValue(val.target.value)}
                  />
                </Col>
                <Col xs="auto" lg="4">
                  
                  <div className="btn-grey">
                    <ButtonGroup>
                    <Button
                      type="submit" 
                      className="AppButton mb-2 mr-sm-2"
                      onClick={!buttonDisabled ? (e) => this.searchE(e, false) : null}
                      >
                        Search
                    </Button>
                    <Button
                      type="submit" 
                      className="AppButton mb-2 mr-sm-2"
                      onClick={!buttonDisabled ? (e) => this.searchE(e, true) : null}
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
                  </div>
                </Col>
            </Form.Row>
          
          {this.renderSearchResults()}

        </Container>
        </Form>
      </div>
    )
  }

  renderTableHeadings() {
    const {entries} = this.state
    const showColumns = this.props.showColumns

    if (entries && entries.length > 0 && showColumns && showColumns.length > 0) {
        return (
            <tr className="hidden-button-parent">
              {
                (UserStore.privileges > 0) ?
                <th key={-1}>
                  Delete
                </th>
                :
                null
              }
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
    e.currentTarget.parentElement.setAttribute("style", "background-color: rgba(135,206,235, 0.3); box-shadow: 0px 0px 5px 2px #dee2e6");
    this.setState({editRow: this.state.entries[index]})
    this.setState({editColumn: key})
    this.setState({lastRow: e.currentTarget.parentElement})
  }

  resetLastRowStyle() {
    if (this.state.lastRow) {
      this.state.lastRow.setAttribute("style", "");
    }
  }

  // Only called if successful
  onUpdateSuccess() {
    if (this.state.lastRow) {
      this.state.lastRow.setAttribute("style", "background-color: rgba(154,205,50, 0.5); box-shadow: 0px 0px 5px 2px #dee2e6");
    }
    this.componentDidMount();
  }

  onUpdateFailure() {
    if (this.state.lastRow) {
      this.state.lastRow.setAttribute("style", "background-color: rgba(255,228,181, 0.5); box-shadow: 0px 0px 5px 2px #dee2e6");
    }
    this.componentDidMount();
  }

  closeConfirmDelete() {
    this.setState({nameToDelete: ''});
  }

  confirmDelete() {
    this.callRemove();
    this.setState({nameToDelete: ''});
  }

  deleteByName(e) {
    const partName = e.currentTarget.parentElement.parentElement.getElementsByTagName('td')[1].innerHTML;

    this.setState({nameToDelete: partName});
  }

  renderTableEntries () {
    const {entries} = this.state
    const showColumns = this.props.showColumns

    if (entries && showColumns && showColumns.length > 0) {

      let arrEntries = []
      var start = this.state.page * this.state.entriesPerPage;
      var end = (this.state.page + 1) * this.state.entriesPerPage;
      var i
      for (i = start; i < end; i++) {

        if (i >= entries.length) {
          break;
        }

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

      let button;
      if (UserStore.privileges > 0) {
        button = (
          <td className="hidden-button" >
            <Button onClick={(e) => this.deleteByName(e)} className="AppButton" size="sm">Delete</Button>
          </td>
        )
      } else {
        button = null;
      }

      let arrEntriesDivided = []
      for (i = 0; i < arrEntries.length; i++) {
        
        arrEntriesDivided.push(
          <tr key={i}className="hidden-button-parent" >
              {button}
            {arrEntries[i]}
          </tr>
        )
      }
      
      return arrEntriesDivided
    } else {
      return null
    }
  }

  changePage(e) {
    e.preventDefault();
    const index = e.currentTarget.getAttribute('index');

    let page = this.state.page;
    switch(index) {
      case 'First':
        page = 0;
        break;
      case 'Prev':
        page = this.state.page - 1;
        if (page < 0) {
          page = 0;
        }
        break;
      case 'Next':
        page = this.state.page + 1;
        if ((page * this.state.entriesPerPage) > this.state.entries.length) {
          page = this.state.page;
        }
        break;
      case 'Last':
        page = Math.floor(this.state.entries.length / this.state.entriesPerPage);
        break;
      default:
        break;
    }
    
    this.resetLastRowStyle();  // temp fix to styling "ghosting" on other pages
    this.setState({page});
  }

  renderTable() {
    if (this.state.isLoading) {
        return (
          <>
            <Loading message="Loading entries..."/>
            <AlertPopup error={this.state.error}/>
          </>
        )
    } else if (!this.state.entries) {
      return <AlertPopup error={this.state.error}/>;
    }

    const last = Math.floor(this.state.entries.length / this.state.entriesPerPage);

    return (
      <div>
        <div className="DBTable">

          <Table className="hidden-button-p-parent" striped bordered size="sm">
              <thead>
                  {this.renderTableHeadings()}
              </thead>
              <tbody>
                  {this.renderTableEntries()}
              </tbody>
          </Table>

          <div className="pagination">
            <Pagination>
              <Pagination.First disabled={this.state.page === 0} index='First' onClick={(e) => this.changePage(e)}/>
              <Pagination.Prev disabled={this.state.page === 0} index='Prev' onClick={(e) => this.changePage(e)}/>
              <Pagination.Item active>{this.state.page + 1}</Pagination.Item>
              <Pagination.Next disabled={this.state.page === last} index='Next' onClick={(e) => this.changePage(e)} />
              <Pagination.Last disabled={this.state.page === last} index='Last' onClick={(e) => this.changePage(e)}/>
            </Pagination>
          </div>

          <Modal show={(this.state.nameToDelete !== '')} onHide={() => this.closeConfirmDelete()}>
            <Modal.Header closeButton>
              <Modal.Title>Deleting part</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete <i>{this.state.nameToDelete}</i>?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => this.closeConfirmDelete()}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => this.confirmDelete()}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
          
          <AlertPopup error={this.state.error}/>
        </div>
      </div>
    )
  }
}

export default DBTable;