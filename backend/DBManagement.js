const { query } = require('express');
const utils = require('./Utils')

const {CONSOLE_RED, CONSOLE_YELLOW, CONSOLE_GREEN} = utils;

// Returns query and changes cols values
// const limitQueryByPrivileges = (query, cols, userID, minPrivileges) => {
//     if (cols.length === 0) {
//         query += ' WHERE';
//     } else {
//         query += ' AND';
//     }

//     query += ' EXISTS (SELECT username FROM users WHERE id = ? AND privileges >= ?)';
//     cols.push(userID);
//     cols.push(minPrivileges);

//     return query;
// }

const selectDB = (query, cols, queryReq, db, res, table) => {
    db.query(query, cols, (err, results) => {
        if (err) {
            utils.printMessage(CONSOLE_RED, table, 'MYSQL ERROR', err.code, 'selecting', query, cols);
            return res.json({
                successful: false,
                query: queryReq,
                error: err,
            })
        }

        if (!results || results.length === 0) {
            if (utils.PRINT_DEBUG_ERRORS_SOFT) {
                utils.printMessage(CONSOLE_YELLOW, table, 'ERROR', "No matching entries exist", 'selecting');
            }
            return res.json({
                successful: false,
                query: queryReq,
            });
        }

        if (utils.PRINT_DEBUG_SUCCESS) {
            utils.printMessage(CONSOLE_GREEN, table, 'SUCCESS', query, 'selecting');
        }
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
                    message = 'Entry already exists'; break;

                case 1690:
                    message = 'Value(s) out of range'; break;
                
                default:
                    message = err.code; break;
            }

            utils.printMessage(CONSOLE_RED, table, 'MYSQL ERROR', err.code, action, query, cols);
            return res.json({
                success: false,
                query: queryReq,
                msg: `Error ${action} entry: ${message}`
            })
        }

        if (data.affectedRows <= 0) {
            if (utils.PRINT_DEBUG_ERRORS_SOFT) {
                utils.printMessage(CONSOLE_YELLOW, table, 'ERROR', "No matching entries exist", action);
            }
            return res.json({
                success: false,
                query: queryReq,
                msg: `Error ${action} entry: No matching entries exist`
            })
        }

        if (utils.PRINT_DEBUG_SUCCESS) {
            utils.printMessage(CONSOLE_GREEN, table, 'SUCCESS', JSON.stringify(cols), action);
        }
        res.json({
            success: true,
            query: queryReq,
        })

        if (req && values) {
            logDB(db, req.session.userID, values);
        }
    });
}

const getLogs = (query, cols, queryReq, db, res) => {
    return selectDB(query, cols, queryReq, db, res, 'DB logs ');
}

const getParts = (query, cols, queryReq, db, res) => {
    return selectDB(query, cols, queryReq, db, res, 'DB parts');
}

const getUsers = (query, cols, queryReq, db, res) => {
    return selectDB(query, cols, queryReq, db, res, 'DB users');
}

const postParts = (query, cols, action, queryReq, db, res, req, values) => {
    modifyDB(query, cols, action, queryReq, db, res, 'DB parts', req, values);
}

const postUsers = (query, cols, action, queryReq, db, res) => {
    return modifyDB(query, cols, action, queryReq, db, res, 'DB users');
}

const logDB = (db, userID, values) => {
    const query = 'INSERT INTO stock.parts_logs(user_id, user_username, action, part_name, part_quantity, part_bookcase, part_shelf) VALUES(?, (SELECT username FROM stock.users WHERE id = ?), ?, ?, ?, ?, ?)';
    const cols = [userID, userID];

    if (!userID || !values.action || !values.name) {
        utils.printMessage(CONSOLE_RED, 'DB logs ', 'ERROR', 'Required column(s) not defined');
        return false;
    }

    cols.push(values.action);
    cols.push(values.name);
    values.quantity ? cols.push(values.quantity) : cols.push(null);
    values.bookcase ? cols.push(values.bookcase) : cols.push(null);
    values.shelf ? cols.push(values.shelf) : cols.push(null);

    db.query(query, cols, (err, results) => {
        if (err) {
            utils.printMessage(CONSOLE_RED, 'DB logs ', 'MYSQL ERROR', err.code, 'logging', query, cols);
            return;
        }

        if (results.affectedRows === 0) {
            utils.printMessage(CONSOLE_RED, 'DB logs ', 'ERROR', 'Action not logged');
            return;
        }

        if (utils.PRINT_DEBUG_SUCCESS) {
            utils.printMessage(CONSOLE_GREEN, 'DB logs ', 'SUCCESS', JSON.stringify(cols));
        }
    });
}

module.exports = {
    getLogs, getParts, getUsers, 
    postParts, postUsers,
    logDB,
    //limitQueryByPrivileges,
};