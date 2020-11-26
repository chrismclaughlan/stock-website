import React from 'react';
import DBTable from './DBTable'
import DBPartUpdate from '../DBModify/DBPartUpdate';
import DBPartAddSub from '../DBModify/DBPartAddSub';

const QUERY_ALL = '/api/parts';
const QUERY_NAME = 'name=';
const QUERY_SIMILAR = 'similar=';

class StockTable extends DBTable{

  async componentDidMount() {
    console.log(" HELLO")
    this.query(QUERY_ALL)
  }

  async search(e, similar) {
    e.preventDefault()
    let searchString = this.state.search;

    searchString = searchString.toLowerCase();

    if (searchString.length === 0) {
      this.query(QUERY_ALL)
    } else if (similar) {
      this.query(`${QUERY_ALL}?${QUERY_NAME + searchString}&${QUERY_SIMILAR + 'true'}`)
    } else {
      this.query(`${QUERY_ALL}?${QUERY_NAME + searchString}`)
    }
  };

  async callRemove() {
    const partName = this.state.nameToDelete;
    if (!partName) {
      console.log('no name to delete')
      return;
    }

    try {

      let res = await fetch('/api/parts/remove', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({parts: [{
            name: partName,
        }]}
        )
      });

      let result = await res.json();
      if (result && result.success) {
        this.setState({error: {message: `Successfully deleted ${partName}`, variant: 'success'}});
        this.componentDidMount();
      }
      else if (result && result.success === false)
      {
        this.setState({error: {message: `Failed to deltete ${partName}`, variant: 'warning'}});
      }

    } catch(e) {
      this.setState({error: {message: `Error delteting ${partName}`, variant: 'danger'}});
    }
  }

  renderEdit() {
    let column = this.state.editColumn
    let row = this.state.editRow

    if (!row || !column) {
      return null
    }

    // COMBINE ADD/SUB WITH BOOKCASE AND SHELF
    return (
      <div>
      <DBPartUpdate 
      editColumn={column}
      partName={row.name} 
      partQuantity={row.quantity}
      partBookcase={row.bookcase}
      partShelf={row.shelf}
      onSuccess={() => this.onUpdateSuccess()}
      onFailure={() => this.onUpdateFailure()}
    />
      </div>
    )
  }

  render() {    
    return (
      <div className="StockTable">
        {this.renderSearchBar()}
        {this.renderEdit()}
        {this.renderTable()}
      </div>
    );
  }
}

export default StockTable;