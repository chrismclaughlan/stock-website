const bcrypt = require('bcrypt');
const { json } = require('express');

class PartsRouter {

    constructor(app, db) {
        this.add(app, db)
        this.remove(app, db)
        this.update(app, db)
    }

    update(app, db) {
        app.post('/api/parts/update', (req, res) => {
            const {parts} = req.body;
            let cols

            if (parts === undefined || !(parts.length > 0)) {
                console.log(`Error: Incorrect post data (1). parts=${parts}`)
                res.json({
                    success: false,
                    msg: 'Error: Incorrect post data (1)'
                })
                return false;
            }

            let {name, quantity, bookcase, shelf} = parts[0]

            if (name === undefined || !(name.length > 0) || 
                quantity === undefined || 
                bookcase === undefined || 
                shelf === undefined
                ) {
                res.json({
                    success: false,
                    msg: 'Error: Incorrect post data (2)'
                })
                return false;
            }

            name = name.trim();
            name = name.toLowerCase()

            cols = [quantity, bookcase, shelf, name];
            let result = db.query('UPDATE parts SET quantity = ?, bookcase = ?, shelf = ? WHERE name = ?', cols, (err, data, fields) => {
                if (err) {
                    let message = '';

                    switch(err.errno) {
                        case 1406:
                            message = 'Data too long'; break;
                        
                        case 1366:
                            message = 'Incorrect value(s) for column(s)'; break;

                        case 1062:
                            message = 'Part already exists'; break;
                        
                        default:
                            message = 'Unknown error'; break;
                    }

                    console.log(`Error adding part: {Errno: ${err.errno}. Code: ${err.code}}`)

                    res.json({
                        success: false,
                        query: parts,
                        msg: `Error adding part: ${message}`
                    })
                    return false;
                }

                console.log(`Successfully updated {n: ${name}, q: ${quantity}, b: ${bookcase}, s: ${shelf}} into stock.parts`)
                res.json({
                    success: true,
                    query: parts,
                })
                return true;
            });

            return result;
        });
    }

    add(app, db) {
        app.post('/api/parts/add', (req, res) => {
            const {parts} = req.body;
            let cols

            if (parts === undefined || !(parts.length > 0)) {
                console.log(`Error: Incorrect post data (1). parts=${parts}`)
                res.json({
                    success: false,
                    msg: 'Error: Incorrect post data (1)'
                })
                return false;
            }

            let {name, quantity, bookcase, shelf} = parts[0]

            if (name === undefined || !(name.length > 0) || 
                quantity === undefined || 
                bookcase === undefined || 
                shelf === undefined
                ) {
                res.json({
                    success: false,
                    msg: 'Error: Incorrect post data (2)'
                })
                return false;
            }

            name = name.trim();
            name = name.toLowerCase()

            cols = [name, quantity, bookcase, shelf];
            let result = db.query('INSERT INTO parts(name, quantity, bookcase, shelf) VALUES(?, ?, ?, ?)', cols, (err, data, fields) => {
                if (err) {
                    let message = '';

                    switch(err.errno) {
                        case 1406:
                            message = 'Data too long'; break;
                        
                        case 1366:
                            message = 'Incorrect value(s) for column(s)'; break;

                        case 1062:
                            message = 'Part already exists'; break;
                        
                        default:
                            message = 'Unknown error'; break;
                    }

                    console.log(`Error adding part: {Errno: ${err.errno}. Code: ${err.code}}`)

                    res.json({
                        success: false,
                        query: parts,
                        msg: `Error adding part: ${message}`
                    })
                    return false;
                }

                console.log(`Successfully inserted {n: ${name}, q: ${quantity}, b: ${bookcase}, s: ${shelf}} into stock.parts`)
                res.json({
                    success: true,
                    query: parts,
                })
                return true;
            });

            return result;
        });
    }

    addPart(app, db, part) {
        // Todo: Iterate over list of parts to add... from add()
    }
    
    removePart(app, db, part) {
        // Todo: Iterate over list of parts to delete... from remove()
    }
    
    remove(app, db) {
        app.post('/api/parts/remove', (req, res) => {
            // parts: [{"name": "item1", quantity: 20}, ... ]
            const parts = req.body.parts;
            let cols

            if (parts === undefined || !(parts.length > 0)) {
                return res.json({
                    success: false,
                    msg: 'An error occured (1)'
                })
            }

            let {name} = parts[0]
            console.log(`name=${name}`)

            if (name === undefined || !(name.length > 0)) {
                return res.json({
                    success: false,
                    msg: 'An error occured (2)'
                })
            }

            name = name.toLowerCase()

            // Check if name already exists
            cols = [name];
            console.log("Querying parts")
            db.query('DELETE FROM parts WHERE name = ?', cols, (err, data, fields) => {
                if (err) {
                    return res.json({
                        success: false,
                        query: parts,
                        msg: 'An error occured, please try again (3)'
                    })
                }

                console.log(data.affectedRows)

                if (data.affectedRows == 0) {
                    return res.json({
                        success: false,
                        query: parts,
                        msg: "Part doesn't exist",
                    })
                }

                if (data.affectedRows == 1) {
                    return res.json({
                        success: true,
                        query: parts,
                    })
                }

                return res.json({
                    success: false,
                    query: parts,
                    msg: "An error occured, please try again (4)",
                })
            })
        });
    }
}

module.exports = PartsRouter;