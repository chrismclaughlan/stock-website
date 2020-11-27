const authoriseUser = (req, res) => {
    if (!req.session.userID) {
        res.json({
            successful: false, 
            msg: 'Not authorised',
        })
        return false;
    }

    return true;
}

const authoriseAdmin = (req, res) => {

    if (!req.session.userID) {
        res.json({
            successful: false, 
            msg: 'Not authorised',
        })
        return false;
    }

    // TODO
    // const QUERY = `SELECT username FROM users WHERE id = '${req.session.userID}'`;
    // db.query()

    return true;
}

const getQuantityNameFromPart = (part, res) => {
    let {name, quantity} = part;

    if (name === undefined || !(name.length > 0) || quantity === undefined) {
        res.json({
            success: false,
            msg: 'Error parsing request: Suitable element(s) of part not defined'
        })
        return null;
    }

    name = name.trim();
    name = name.toLowerCase()
    return [quantity, name];
}

const getNameFromPart = (part, res) => {
    let {name} = part;

    if (name === undefined || !(name.length > 0)) {
        res.json({
            success: false,
            msg: 'Error parsing request: Name of part not defined'
        })
        return null;
    }

    name = name.trim();
    name = name.toLowerCase()
    return name;
}

const getPartsFromReq = (req, res) => {
    const {parts} = req.body;

    if (parts === undefined || !(parts.length > 0)) {
        res.json({
            success: false,
            msg: 'Error parsing request: parts not defined'
        })
        return null;
    }

    return parts;
}

const getColsFromPart = (part, res) => {
    let {name, quantity, bookcase, shelf} = part;

    if (name === undefined || !(name.length > 0) || 
        quantity === undefined || 
        bookcase === undefined || 
        shelf === undefined
        ) {
        res.json({
            success: false,
            msg: 'Error parsing request: Suitable element(s) of part not defined'
        })
        return null;
    }

    name = name.trim();
    name = name.toLowerCase()
    return [quantity, bookcase, shelf, name];
};

const queryParts = (query, cols, verbMsg, parts, db, res) => {
    return db.query(query, cols, (err, data, fields) => {
        if (err) {
            let message = '';

            switch(err.errno) {
                case 1406:
                    message = 'Data too long'; break;
                
                case 1366:
                    message = 'Incorrect value(s) for column(s)'; break;

                case 1062:
                    message = 'Part already exists'; break;

                case 1690:
                    message = 'Value(s) out of range'; break;
                
                default:
                    message = err.code; break;
            }

            console.log(`Error ${verbMsg} part: {Errno: ${err.errno}. Code: ${err.code}}`)

            res.json({
                success: false,
                query: parts,
                msg: `Error ${verbMsg} part: ${message}`
            })
            return false;
        }

        if (data.affectedRows <= 0) {
            res.json({
                success: false,
                query: parts,
                msg: `Error ${verbMsg} part: Part doesn't exist`
            })
            return false;
        }

        res.json({
            success: true,
            query: parts,
        })
        return true;
    });
}

class PartsRouter {

    constructor(app, db) {
        this.add(app, db)
        this.remove(app, db)
        this.update(app, db)
    }

    update(app, db) {
        app.post('/api/parts/update', (req, res) => {


            if (!authoriseUser(req, res)) {
                return false;
            }

            const parts = getPartsFromReq(req, res);
            if (!parts) {
                return false;
            }

            let part = parts[0];
            part.quantity = Math.abs(part.quantity);

            let query, cols;
            if (authoriseAdmin(req, res)) {
                cols = getColsFromPart(part, res);
                query = 'UPDATE parts SET quantity = quantity - ?, bookcase = ?, shelf = ? WHERE name = ?';
            } else {
                cols = getQuantityNameFromPart(part, res);
                query = 'UPDATE parts SET quantity = quantity - ? WHERE name = ?';
            }

            if (!cols) {
                return false;
            }

            const result = queryParts(query, cols, 'updating', parts, db, res);
            
            if (!result) {
                console.log(`Failed to update part: Query=${query}`);
                return false;
            } else {
                console.log(`Successfully updated part: Query=${query}`);
                return true;
            }
        });
    }

    // Admin
    add(app, db) {
        app.post('/api/parts/add', (req, res) => {

            if (!authoriseAdmin(req, res)) {
                return false;
            }

            const parts = getPartsFromReq(req, res);
            if (!parts) {
                return false;
            }

            const cols = getColsFromPart(parts[0], res);
            if (!cols) {
                return false;
            }
            
            const query = 'INSERT INTO parts(quantity, bookcase, shelf, name) VALUES(?, ?, ?, ?)';
            return queryParts(query, cols, 'adding', parts, db, res);
        });
    }

    // addPart(app, db, part) {
    //     // Todo: Iterate over list of parts to add... from add()
    // }
    
    // removePart(app, db, part) {
    //     // Todo: Iterate over list of parts to delete... from remove()
    // }
    
    // Admin
    remove(app, db) {
        app.post('/api/parts/remove', (req, res) => {

            if (!authoriseAdmin(req, res)) {
                return false;
            }

            const parts = getPartsFromReq(req, res);
            if (!parts) {
                return false;
            }

            const name = getNameFromPart(parts[0], res);
            if (!name) {
                return false;
            }

            const cols = [name];
            
            const query = 'DELETE FROM parts WHERE name = ?';
            return queryParts(query, cols, 'removing', parts, db, res);

        });
    }
}

module.exports = PartsRouter;