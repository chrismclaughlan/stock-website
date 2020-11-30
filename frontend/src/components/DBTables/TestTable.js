import DBTable from './DBTable'

const renderHelpTextSearch = () => {
    return (
      <>
        Search:
        <li>Search: Search for exact 1:1 match</li>
        <li>Search Similar: Search for similar matches that start with <i>some string</i></li>
        <li>Reset: Reset search and refresh table entries</li>
      </>
    )
}

const renderHelpText = () => {
    return (
      <ul>
          {renderHelpTextSearch()}

        <br></br>

        <li>part_quantity: Quantity of parts removed</li>
        <li>part_bookcase: Bookcase changed to <i>some value</i></li>
        <li>part_shelf: Shelf changed to <i>some value</i></li>
      </ul>
    )
}

const TestTable = () => {
    return (
        <div className="TestTable">
            <h1 className="display-4">Test Table</h1>
          <DBTable 
              showSearchBar={true}
              searchBarPlaceholder="Search test"
              showColumns={["Delete", "name", "quantity", "bookcase", "shelf"]} 
              renderHelpText={() => renderHelpText()}
              tableQueries={{
                  search: {
                      url: '/api/parts', string: 'name=', similar: 'similar='
                    },
                    remove: {
                        url: '/api/parts/remove', outsideProperty: 'parts', insideProperty: 'name',
                    }
                }}
          />
        </div>
    );
}

export default TestTable;