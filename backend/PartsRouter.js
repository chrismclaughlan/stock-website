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
            let query;
            const {quantity, bookcase, shelf} = part;
            query = 'UPDATE parts SET ';

            if (quantity) {
                query += 'quantity = quantity - ?';
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

            const parts = utils.getPartsFromReq(req, res);
            if (!parts) {
                return false;
            }

            const part = parts[0];

            let cols = utils.getColsFromPart(part, res);
            if (!cols) {
                return false;
            }
            
            let query = 'INSERT INTO parts(quantity, bookcase, shelf, name) VALUS(?, ?, ?, ?)'
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
            const parts = utils.getPartsFromReq(req, res);
            if (!parts) {
                return false;
            }

            const part = parts[0];

            const name = utils.getNameFromPart(part, res);
            if (!name) {
                return false;
            }

            let cols = [name];
            let query = 'DELETE FROM parts WHERE name = ?';
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