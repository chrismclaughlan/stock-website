const utils = require('./Utils')
const dbManagement = require('./DBManagement')

class PartsRouter {

    constructor(app, db) {
        this.add(app, db)
        this.remove(app, db)
        this.update(app, db)
    }

    update(app, db) {
        app.post('/api/parts/update', (req, res) => {


            if (!utils.authoriseUser(req, res)) {
                return false;
            }

            const parts = utils.getPartsFromReq(req, res);
            if (!parts) {
                return false;
            }

            let part = parts[0];
            part.quantity = Math.abs(part.quantity);

            const name = utils.getNameFromPart(part, res);
            if (!name) {
                return false;
            }

            let cols = [];
            let query = '';
            const {quantity, bookcase, shelf} = part;
            if (utils.authoriseAdmin(req, res)) {

                query = 'UPDATE parts SET ';
    
                if (quantity) {
                    query += 'quantity = quantity - ?';
                    cols.push(quantity);
                }
    
                if (bookcase) {
                    if (cols.length > 0) {
                        query += ', '
                    }
                    query += 'bookcase = ?';
                    cols.push(bookcase);
                }
    
                if (shelf) {
                    if (cols.length > 0) {
                        query += ', '
                    }
                    query += 'shelf = ?';
                    cols.push(shelf);
                }

                if (cols.length === 0) {
                    res.json({
                        success: false,
                        msg: 'Error parsing request: Suitable element(s) of part not defined'
                    })
                    return false;
                }

                query += ' WHERE name = ?'
                cols.push(name);

            } else {
                query = 'UPDATE parts SET quantity = quantity - ? WHERE name = ?';
                
                cols = utils.getQuantityNameFromPart(part, res);
                if (!cols) {
                    return false;
                }
            }            

            // action, partName, partQuantity, partBookcase, partShelf
            const action = 'updating';
            const values = {
                action,
                name,
                quantity,
                bookcase,
                shelf,
            }
            dbManagement.postParts(query, cols, action, part, db, res, req, values);
            
            // query = `INSERT INTO stock.parts_logs `
            
            // query = `INSERT INTO stock.parts_logs(user_id, username, action, name, bookcase) VALUES(?, ?, ?, ?, ?)`;
            // cols = [req.userID, "chris", "update", "dontdelete", 20];
        });
    }

    // Admin
    add(app, db) {
        app.post('/api/parts/add', (req, res) => {

            if (!utils.authoriseAdmin(req, res)) {
                return false;
            }

            const parts = utils.getPartsFromReq(req, res);
            if (!parts) {
                return false;
            }

            const part = parts[0];

            // const cols = utils.getColsFromPart(part, res);
            // if (!cols) {
            //     return false;
            // }
            
            // const query = 'INSERT INTO parts(quantity, bookcase, shelf, name) VALUES(?, ?, ?, ?)';

            const action = 'adding';
            const values = {
                action,
                name: part.name,
                quantity: part.quantity,
                bookcase: part.bookcase,
                shelf: part.shelf,
            }
            dbManagement.postParts(query, cols, action, part, db, res, req, values);
        });
    }

    // Admin
    remove(app, db) {
        app.post('/api/parts/remove', (req, res) => {

            if (!utils.authoriseAdmin(req, res)) {
                return false;
            }

            const parts = utils.getPartsFromReq(req, res);
            if (!parts) {
                return false;
            }

            const part = parts[0];

            const name = utils.getNameFromPart(part, res);
            if (!name) {
                return false;
            }

            const cols = [name];
            
            const query = 'DELETE FROM parts WHERE name = ?';

            const action = 'deleting';
            const values = {
                action,
                name,
            }
            dbManagement.postParts(query, cols, action, part, db, res, req, values);

            //dbManagement.logDB();
        });
    }
}

module.exports = PartsRouter;