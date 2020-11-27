const utils = require('./Utils')

const selectDB = (query, cols, queryReq, db, res, table) => {
    db.query(query, cols, (err, results) => {
        if (err) {
            utils.printMessage(table, 'MYSQL ERROR', err.code, 'selecting');
            res.send({
                successful: false,
                query: queryReq,
                error: err,
            })
            return;
        }

        if (!results || results.length === 0) {
            utils.printMessage(table, 'ERROR', "No matching entries exist", 'selecting');
            res.send({
                successful: false,
                query: queryReq,
            });
            return;
        }

        utils.printMessage(table, 'SUCCESS', query);
        res.send({
            successful: true,
            query: queryReq,
            results,
        });
    });
}

const modifyDB = (query, cols, action, queryReq, db, res, table) => {
    var querySuccessful = false;

    db.query(query, cols, (err, data) => {
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

            utils.printMessage(table, 'MYSQL ERROR', err.code, action);

            res.json({
                success: false,
                query: queryReq,
                msg: `Error ${action} entry: ${message}`
            })
            return;
        }

        if (data.affectedRows <= 0) {
            utils.printMessage(table, 'ERROR', "No matching entries exist", action);
            res.json({
                success: false,
                query: queryReq,
                msg: `Error ${action} entry: No matching entries exist`
            })
            return;
        }

        querySuccessful = true;
        console.log(data)
        //utils.printMessage(table, 'SUCCESS', (data.sql !== undefined) ? data.sql : data.sql);
        res.json({
            success: true,
            query: queryReq,
        })

        //logAction(db);
    });

    return querySuccessful;
}

const getLogs = (query, cols, queryReq, db, res) => {
    return selectDB(query, cols, queryReq, db, res, 'stock.parts_logs');
}

const getParts = (query, cols, queryReq, db, res) => {
    return selectDB(query, cols, queryReq, db, res, 'stock.parts');
}

const getUsers = (query, cols, queryReq, db, res) => {
    return selectDB(query, cols, queryReq, db, res, 'stock.users');
}

const postParts = (query, cols, action, queryReq, db, res) => {
    if (modifyDB(query, cols, action, queryReq, db, res, 'stock.parts')) {
        // required: user_id, user_username, action, part_name
        // optional: part_quantity, part_bookcase, part_shelf
        console.log(query);
        console.log(cols);
        console.log(action);
        console.log(queryReq);
        logDB()
    }
}

const postUsers = (query, cols, action, queryReq, db, res) => {
    return modifyDB(query, cols, action, queryReq, db, res, 'stock.users');
}

//TODO db.escape(var)
//TODO insert multiple recrods eg. cols = [[...], [...], [...]]
const logDB = (db) => {
    return;
    
    /* Log action */
    const query = `INSERT INTO stock.parts_logs(user_id, username, action, name, bookcase) VALUES(?, ?, ?, ?, ?)`;
    const cols = [5, "chris", "update", "dontdelete", 20];
    db.query(query, cols, (err, data, fields) => {
        if (err) {
            utils.printMessage('stock.parts_log', 'ERROR', err.code);
        }

        utils.printMessage('stock.parts_log', 'SUCCESS', query);
    });
}

module.exports = {
    getLogs, getParts, getUsers, postParts, postUsers
};