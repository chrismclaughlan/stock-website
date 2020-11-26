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