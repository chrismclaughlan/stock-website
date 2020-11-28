const { query } = require('express');
const utils = require('./Utils')

const selectDB = (query, cols, queryReq, db, res, table) => {
    db.query(query, cols, (err, results) => {
        if (err) {
            utils.printMessage(table, 'MYSQL ERROR', err.code, 'selecting', query, cols);
            console.log(query);
            console.log(cols);
            res.json({
                successful: false,
                query: queryReq,
                error: err,
            })
            return;
        }

        if (!results || results.length === 0) {
            utils.printMessage(table, 'ERROR', "No matching entries exist", 'selecting');
            res.json({
                successful: false,
                query: queryReq,
            });
            return;
        }

        utils.printMessage(table, 'SUCCESS', query);
        res.json({
            successful: true,
            query: queryReq,
            results,
        });
    });
}

const modifyDB = (query, cols, action, queryReq, db, res, table, req, values) => {
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

            utils.printMessage(table, 'MYSQL ERROR', err.code, action, query, cols);
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

        utils.printMessage(table, 'SUCCESS', query);
        res.json({
            success: true,
            query: queryReq,
        })

        if (req && values) {
            logDB(req.session.userID, db, values);
        }
    });
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

const postParts = (query, cols, action, queryReq, db, res, req, values) => {
    modifyDB(query, cols, action, queryReq, db, res, 'stock.parts', req, values);
}

const postUsers = (query, cols, action, queryReq, db, res) => {
    return modifyDB(query, cols, action, queryReq, db, res, 'stock.users');
}


const logDB = (userID, db, values) => {
    const query = 'SELECT username FROM stock.users WHERE id = ? LIMIT 1';
    const cols = [userID];
    
    db.query(query, cols, (err, results) => {
        if (err) {
            utils.printMessage('stock.users', 'MYSQL ERROR', err.code, 'finding user', query, cols);
            return;
        }

        if (results.affectedRows <= 0) {
            utils.printMessage('stock.users', 'ERROR', `User with id=${userID} does not exist`, 'finding user');
            return;
        }

        utils.printMessage('stock.users', 'SUCCESS', query, 'finding user');
        postLogDB(db, userID, results[0].username, values);
    });
}

// required: user_id, user_username, action, part_name
// optional: part_quantity, part_bookcase, part_shelf
const postLogDB = (db, userID, username, values) => {
    const query = 'INSERT INTO stock.parts_logs(user_id, user_username, action, part_name, part_quantity, part_bookcase, part_shelf) VALUES(?, ?, ?, ?, ?, ?, ?)';
    const cols = [userID, username];

    if (!userID || !username || !values.action || !values.name) {
        utils.printMessage('stock.parts_log', 'ERROR', 'Required column(s) not defined');
        return false;
    }

    cols.push(values.action);
    cols.push(values.name);
    values.quantity ? cols.push(values.quantity) : cols.push(null);
    values.bookcase ? cols.push(values.bookcase) : cols.push(null);
    values.shelf ? cols.push(values.shelf) : cols.push(null);

    db.query(query, cols, (err, results) => {
        if (err) {
            utils.printMessage('stock.parts_log', 'MYSQL ERROR', err.code, 'logging', query, cols);
            return;
        }

        if (results.affectedRows === 0) {
            utils.printMessage('stock.parts_log', 'ERROR', 'Action not logged');
            return;
        }

        utils.printMessage('stock.parts_log', 'SUCCESS', query);
    });
}

module.exports = {
    getLogs, getParts, getUsers, 
    postParts, postUsers,
    logDB,
};