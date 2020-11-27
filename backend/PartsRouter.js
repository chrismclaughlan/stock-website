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

            let query, cols;
            if (utils.authoriseAdmin(req, res)) {
                cols = utils.getColsFromPart(part, res);
                query = 'UPDATE parts SET quantity = quantity - ?, bookcase = ?, shelf = ? WHERE name = ?';
            } else {
                cols = utils.getQuantityNameFromPart(part, res);
                query = 'UPDATE parts SET quantity = quantity - ? WHERE name = ?';
            }

            if (!cols) {
                return false;
            }

            dbManagement.postParts(query, cols, 'updating', parts, db, res);
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

            const cols = utils.getColsFromPart(parts[0], res);
            if (!cols) {
                return false;
            }
            
            const query = 'INSERT INTO parts(quantity, bookcase, shelf, name) VALUES(?, ?, ?, ?)';
            dbManagement.postParts(query, cols, 'adding', parts, db, res);
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

            const name = utils.getNameFromPart(parts[0], res);
            if (!name) {
                return false;
            }

            const cols = [name];
            
            const query = 'DELETE FROM parts WHERE name = ?';
            dbManagement.postParts(query, cols, 'removing', parts, db, res);
        });
    }
}

module.exports = PartsRouter;