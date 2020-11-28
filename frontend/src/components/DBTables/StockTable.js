import React from 'react';
import DBTable from './DBTable'
import DBPartUpdate from '../DBModify/DBPartUpdate';

const QUERY_ALL = '/api/parts';
const QUERY_STRING = 'name=';
const QUERY_SIMILAR = 'similar=';

class StockTable extends DBTable{

  search(similar) {
    super.searchAPI(similar, QUERY_ALL, QUERY_STRING, QUERY_SIMILAR);
  }

  async callRemove() {
    const url = '/api/parts/remove';
    const data = {
      parts: [
        {name: this.state.nameToDelete, },
      ]
    };
    super.callRemove(url, data);
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

  renderHelpText() {
    return (
      <ul>
        {this.renderHelpTextSearch()}

        <br></br>

        Update:
        <li>quantity: Enter quantity to remove from database</li>
        <li>bookcase: Enter new bookcase</li>
        <li>shelf: Enter new shelf</li>

        <br></br>

        Table:
        <li>Delete: Clicking delete will remove this part from the database entirely</li>
        <li>quantity: Quantity of parts removed</li>
        <li>bookcase: Current bookcase where part is located</li>
        <li>shelf: Current shelf where part is located</li>
      </ul>
    )
  }

  render() {    
    return (
      <div className="StockTable">
        {this.renderSearchBar('Search Part Names')}
        {this.renderEdit()}
        {this.renderTable()}
      </div>
    );
  }
}

export default StockTable;