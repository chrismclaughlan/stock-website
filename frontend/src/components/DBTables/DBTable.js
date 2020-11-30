import React, { useRef } from 'react';
import AlertPopup from '../AlertPopup'
import {Table, Form, Container, Col, Button, ButtonGroup, Pagination, Modal} from 'react-bootstrap';
import Loading from '../Loading'
import UserStore from '../../store/UserStore'
const utils = require('../../Utils');

const MAX_SEARCH_LENGTH = 255;
const DEFAULT_ENTRIES_PER_PAGE = 16;

class DBTable extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      // query: Contains query returned from server that contains info on original query to server, used to observe what went wrong
      query: null,

      // entries: Contains entries returned from server to fill table with
      entries: null,

      // isLoading: True if loading/fetching data. Used to display loading spinner
      isLoading: false,

      // disableButton: True if busy fetching results, prevents user from issuing duplicate requests
      disableButton: false,

      // error: Contains info on how to display error. Used to display wh query went wrong
      error: {
        message: null,
        variant: null,
      },

      // search: Search string sent to server. Used to search for names in table
      search: '',
      searchLast: {},  // TODO

      // searchSimilar: When true server queries all names that start with what is contained in search string
      searchSimilar: false,

      maxSearchLength: MAX_SEARCH_LENGTH,

      // nameToDelete: Contains the name of the entry where "Delete" button was pressed
      nameToDelete: '',

      // editColumn: Contains the name of the column clicked on in table
      editColumn: null,

      // editRow: Contains entry information of the table row that was clicked
      editRow: null,

      // lastRow: Contains parent element ("row" or <tr> element) of table entry clicked
      lastRow: null,

      // page: Current page of entries to show
      page: 0,

      entriesPerPage: DEFAULT_ENTRIES_PER_PAGE,

      // showHelp: True displays modal containing helpful text about table
      showHelp: false,

      insideRef: React.createRef(),
    }

    this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  
  // Perform search to fetch table entries
  componentDidMount() {
    this.search();
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(e) {
    if (this.state.insideRef && !this.state.insideRef.current.contains(e.target)) {
      this.resetEdit();
    }
  }

  // Performs query for search with different query properties
  searchAPI(searchString, similar, api_query_all, api_query_string, api_query_similar) {

    searchString = searchString.toLowerCase();

    if (searchString.length === 0) {
      this.query(api_query_all)
    } else if (similar) {
      this.query(`${api_query_all}?${api_query_string + searchString}&${api_query_similar + 'true'}`)
    } else {
      this.query(`${api_query_all}?${api_query_string + searchString}`)
    }
  }
  
  // Handles search from event
  searchE(e, similar) {
    e.preventDefault();
    this.resetLastRowStyle();
    this.setState({
      searchSimilar: similar,
    }, this.search);
  };

  // Posts request to server to remove a table entry
  async callRemove(url, data) {
    this.setState({disableButton: true});

    const nameToDelete = this.state.nameToDelete;
    if (!nameToDelete) {
      console.log('no name to delete')
      return;
    }

    fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
    .then(utils.handleFetchError)
    .then(res => res.json())
    .then((result) => {

      if (result && result.success) {
        this.setState({
          error: {
            message: `Successfully deleted ${nameToDelete}`, 
            variant: 'success',
          },
          disableButton: false,
        });
        this.searchLast();
      }
      else if (result && result.success === false)
      {
        this.setState({
          error: {
            message: `Failed to delete ${nameToDelete}`, 
            variant: 'warning',
          },
          disableButton: false,
        });
      }
    })
    .catch((err) => {
      console.log(`Error trying to fetch '${url}': '${err}'`)
      this.setState({
          error: {
              message: `Error deleting ${nameToDelete}: ${err}`, 
              variant: 'danger',
        },
        disableButton: false,
      })
    })
  }

  // Gets request from server to fill table entries
  query(url) {
    this.setState({
      error: {
        message: null, 
        variant: null,
      },
      disableButton: true,
    })

    fetch(url)
    .then(utils.handleFetchError)
    .then(res => res.json())
    .then((result) => {
      
      if (result.successful) {
        this.setState({
          isLoading: false, 
          disableButton: false,
          entries: result.results,
          query: result.query,
          searchLast: {string: result.query.string, similar: result.query.similar},
        }, this.resetEdit)
      } else {          
        let reason;
        if (result.query && result.query.string) {
          reason = `Could not find  ${result.query.string}  in database`;
        } else {
          reason = 'Could not find any entries in database';
        }

        this.setState({
          isLoading: false,
          disableButton: false,
          query: null, 
          error: {
            message: `Query unsuccessful. ${reason}`, 
            variant: "warning",
          },
        });
      }
    })
    .catch((err) => {
      console.log(`Error trying to fetch '${url}': '${err}'`)
      this.setState({
        isLoading: false, 
        disableButton: false,
        query: null, 
        error: {
          message: 'Error trying to query database',
          variant: 'danger',
        },
      })
    })
  }

  // Handles user input for search string
  setSearchValue(val) {
    val.trim()
    if (val.length > this.state.maxSearchLength) {
      return;
    }

    this.setState({search: val})
  }

  // Handles event to reset search and table
  reset(e) {
    e.preventDefault()
    this.setState({
      search: '', 
      searchLast: {},
    }, this.resetEdit)
    this.search();
  }

  resetEdit() {
    if (this.state.lastRow) {
      this.state.lastRow.setAttribute("style", "");
    }
    this.setState({
      editRow: null,
      editColumn: null,
      lastRow: null
    })  
  }

  renderSearchResults() {
    if (!this.state.query || !this.state.query.string || !this.state.entries || !(this.state.entries.length > 0)) {
      return null
    }
    
    return (
      <Form.Text muted>
        <p>Found {this.state.entries.length} {(this.state.query.similar) ? 'similar' : null} search result(s) for: {this.state.query.string}</p>
      </Form.Text>
    )
  }

  renderSearchBar(placeholder) {
    return (
      <div className="SearchBar">
        <Form inline noValidate 

        // Default to normal search
        onSubmit={!this.state.buttonDisabled ? (e) => this.searchE(e, false) : null}
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
                      onClick={!this.state.buttonDisabled ? (e) => this.searchE(e, false) : null}
                      >
                        Search
                    </Button>
                    <Button
                      type="submit" 
                      className="AppButton mb-2 mr-sm-2"
                      onClick={!this.state.buttonDisabled ? (e) => this.searchE(e, true) : null}
                      >
                        Search Similar
                    </Button>
                    <Button
                      type="submit" 
                      className="AppButton mb-2 mr-sm-2"
                      style={{paddingRight: "20px"}}
                      onClick={!this.state.buttonDisabled ? (e) => this.reset(e) : null}
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
                  Object.keys(entries[0]).map(function(key, index) {
                        if (showColumns.includes(key)) {
                            return <th key={index}>{key}</th>
                        } else {
                          return null
                        }
                      }
                  )
              }
              {
                (UserStore.privileges > 0 && showColumns.includes('Delete')) ?
                <th key={-1}>
                  Delete
                </th>
                :
                null
              }
            </tr>
        )
      } else {
        return null
      }
  }

  // Handles event when clicking table entry. Will change css styling of row to indicate selection.
  setEdit(e, key) {
    if (this.state.lastRow) {
      this.state.lastRow.setAttribute("style", "");
    }
    
    const index = e.currentTarget.getAttribute('index');
    e.currentTarget.parentElement.setAttribute("style", "background-color: rgba(135,206,235, 0.4) !important; border-left: 15px solid rgb(250, 223, 25) !important;");
    this.setState({editRow: this.state.entries[index]})
    this.setState({editColumn: key})
    this.setState({lastRow: e.currentTarget.parentElement})
  }

  // Resets css styling of table entry selection
  resetLastRowStyle() {
    if (this.state.lastRow) {
      this.state.lastRow.setAttribute("style", "");
    }
  }

  // Callback for successful search
  onUpdateSuccess() {
    if (this.state.lastRow) {
      this.state.lastRow.setAttribute("style", "background-color: rgba(154,205,50, 0.5); box-shadow: 0px 0px 5px 2px #dee2e6");
    }
    this.searchLast();
  }

  // Callback for unsuccessful search
  onUpdateFailure() {
    if (this.state.lastRow) {
      this.state.lastRow.setAttribute("style", "background-color: rgba(255,228,181, 0.5); box-shadow: 0px 0px 5px 2px #dee2e6");
    }
    //this.searchLast();
  }

  // Closes entry deletion modal
  closeConfirmDelete() {
    this.setState({nameToDelete: ''});
  }

  // Confirms entry deletion
  confirmDelete() {
    this.callRemove();
    this.setState({nameToDelete: ''});
  }

  // Grabs name of entry to delete
  deleteByName(e) {
    const partName = e.currentTarget.parentElement.parentElement.getElementsByTagName('td')[0].innerHTML;  // first td tag should be name/entry identifier

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
      if (UserStore.privileges > 0 && showColumns.includes('Delete')) {
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
            {arrEntries[i]}
            {button}
          </tr>
        )
      }
      
      return arrEntriesDivided
    } else {
      return null
    }
  }

  // Changes page of entries to render
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

  renderHelpText() {

    if (this.props.renderHelpText) {
      return this.props.renderHelpText();
    } else {
      return <p>Help not implemented for this table</p>;
    }
  }

  renderHelpTextSearch() {
    return (
      <>
        Search:
        <li>Search: Search for exact 1:1 match</li>
        <li>Search Similar: Search for similar matches that start with <i>some string</i></li>
        <li>Reset: Reset search and refresh table entries</li>
      </>
    )
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

          <Table className="hidden-button-p-parent" striped bordered size="sm" ref={this.insideRef}>
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

          <Modal
            show={this.state.showHelp}
            onHide={() => this.setState({showHelp: false})}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Help
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.renderHelpText()}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => this.setState({showHelp: false})}>Close</Button>
            </Modal.Footer>
          </Modal>

          <Button className="HelpButton" onClick={() => this.setState({showHelp: true})}>
            Help
          </Button>

          <AlertPopup error={this.state.error}/>
        </div>
      </div>
    )
  }

  // search() {
  //   this.searchAPI(this.state.searchSimilar, this.props.tableQueries.search.url, this.props.tableQueries.search.string, this.props.tableQueries.search.similar);
  // }

  render () {
    return (
      <div className="DBTable">
        <h1 className="display-4">{this.props.title}</h1>
        {this.props.showSearchBar ? this.renderSearchBar(this.props.searchBarPlaceholder) : null}
        {this.props.showEdit ? <p>render edit</p> : null}
        {this.renderTable()}
      </div>
    )
  }
}

export default DBTable;