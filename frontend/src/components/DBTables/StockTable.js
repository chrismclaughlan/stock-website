import React from 'react';
import DBTable from './DBTable'

const QUERY_ALL = '/api/parts';
const QUERY_NAME = 'name=';
const QUERY_SIMILAR = 'similar=';

class StockTable extends DBTable{

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.query(QUERY_ALL)
  }

  async search(e, similar) {
    e.preventDefault()
    let searchString = this.state.search;

    searchString = searchString.toLowerCase();

    if (searchString.length == 0) {
      this.query(QUERY_ALL)
    } else if (similar) {
      this.query(`${QUERY_ALL}?${QUERY_NAME + searchString}&${QUERY_SIMILAR + 'true'}`)
    } else {
      this.query(`${QUERY_ALL}?${QUERY_NAME + searchString}`)
    }
  };

  render() {    
    return (
      <div className="StockTable">
        {this.renderSearchBar()}
        {this.renderTable()}
      </div>
    );
  }
}

export default StockTable;