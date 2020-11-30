const utils = require('./Utils')
const dbManagement = require('./DBManagement')
const auth = require('./Auth')

class PartsRouter {

    constructor(app, db) {
        this.add(app, db)
        this.remove(app, db)
        this.update(app, db)
    }

    update(app, db) {
        app.post('/api/parts/update', auth.userAuthenticated, (req, res) => {
            let query, cols = [];

            /* Validate and retreive POST data */

            if (! utils.validateRequest(req.body, ['parts'], res)) return;
            const {parts} = req.body;
            
            if (! utils.validateIsArray(parts, res)) return;
            const part = parts[0];

            if (! utils.validateRequest(part, ['name'], res)) return false;
            let {name, quantity, bookcase, shelf} = part;

            name = name.trim().toLowerCase();
            quantity = (quantity !== undefined) ? part.quantity : null;

            /* Construct query */

            query = 'UPDATE parts SET ';

            if (quantity) {
                query += 'quantity = quantity + ?';
                cols.push(quantity);
            }

            // Only allow admins to change bookcase / shelf
            if (auth.userIsAdmin(req)) {

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
            }

            // A minimum of 1 column has to be provided
            if (cols.length === 0) {
                res.json({
                    success: false,
                    msg: 'Error parsing request: Suitable element(s) of part not defined'
                })
                return false;
            }

            query += ' WHERE name = ?'
            cols.push(name);

           // query = dbManagement.limitQueryByPrivileges(query, cols, req.session.userID, auth.PRIVILIGES_ADMIN);

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
        });
    }

    add(app, db) {
        app.post('/api/parts/add', auth.userAuthorised, (req, res) => {
            let query, cols = [];

            /* Validate and retreive POST data */

            if (! utils.validateRequest(req.body, ['parts'], res)) return;
            const {parts} = req.body;

            if (! utils.validateIsArray(parts, res)) return;
            const part = parts[0];

            if (! utils.validateRequest(part, ['name', 'quantity', 'bookcase', 'shelf'], res)) return;
            let {name, quantity, bookcase, shelf} = part;

            name = name.trim().toLowerCase();

            /* Construct query */
            
            query = 'INSERT INTO parts(name, quantity, bookcase, shelf) VALUES(?, ?, ?, ?)'
            cols = [name, quantity, bookcase, shelf];

            // let query = 'INSERT INTO parts(quantity, bookcase, shelf, name) SELECT ?, ?, ?, ? FROM users WHERE id = ? AND privileges >= ?'
            // cols.push(req.session.userID);
            // cols.push(auth.PRIVILIGES_ADMIN);

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

    remove(app, db) {
        app.post('/api/parts/remove', auth.userAuthorised, (req, res) => {
            let query, cols = [];

            /* Validate and retreive POST data */

            if (! utils.validateRequest(req.body, ['parts'], res)) return;
            const {parts} = req.body;

            if (! utils.validateIsArray(parts, res)) return;
            const part = parts[0];

            if (! utils.validateRequest(part, ['name'], res)) return;
            let {name} = part;
            
            name = name.trim().toLowerCase();

            /* Construct query */

            query = 'DELETE FROM parts WHERE name = ?';
            cols = [name];

            //query = dbManagement.limitQueryByPrivileges(query, cols, req.session.userID, auth.PRIVILIGES_ADMIN)

            const action = 'deleting';
            const values = {
                action,
                name,
            }
            dbManagement.postParts(query, cols, action, part, db, res, req, values);
        });
    }
}

module.exports = PartsRouter;