const { json } = require('express');
const dbManagement = require('./DBManagement');
const utils = require('./Utils')
const auth = require('./Auth')

class UsersRouter {

    constructor(app, db) {
        this.add(app, db);
        this.remove(app, db);
        this.update(app, db);
        this.changeMyPassword(app, db);
    }

    changeMyPassword(app, db) {
        app.post('/api/users/change-my-password', auth.userAuthenticated, (req, res) => {

            const users = utils.getUsersFromReq(req, res);
            if (!users) {
                return false;
            }

            const user = users[0];
            const cols = utils.getPasswordUserIDFromUser(user, req, res);
            if (!cols) {
                return false;
            }
            
            const query = 'UPDATE users SET password = ? WHERE id = ?';

            dbManagement.postUsers(query, cols, 'changing password', users, db, res);
        });
    }

    update(app, db) {
        app.post('/api/users/update', auth.userAuthorised, (req, res) => {

            const users = utils.getUsersFromReq(req, res);
            if (!users) {
                return false;
            }

            const user = users[0];
            let cols = utils.getPasswordUsernameFromUser(user, res);
            if (!cols) {
                return false;
            }

            let query = 'UPDATE users SET password = ? WHERE username = ?'
            //let query = 'UPDATE stock.users u, (select username from stock.users where id = ? AND privileges >= ?) a set u.password = ? where u.username = ?';
            //cols = [req.session.userID, auth.PRIVILIGES_ADMIN, ...cols];

            dbManagement.postUsers(query, cols, 'updating', users, db, res);
        });
    }

    add(app, db) {
        app.post('/api/users/add', auth.userAuthorised, (req, res) => {

            const users = utils.getUsersFromReq(req, res);
            if (!users) {
                return false;
            }

            const user = users[0]
            let cols = utils.getPasswordUsernameFromUser(user, res);
            if (!cols) {
                return false;
            }

            let query = 'INSERT INTO users(password, username) VALUES(?, ?)';
            //let query = 'INSERT INTO users(password, username) SELECT ?, ?';
            //let tmpcols = [];
            //query = dbManagement.limitQueryByPrivileges(query, tmpcols, req.session.userID, auth.PRIVILIGES_ADMIN);
            //cols = [...cols, ...tmpcols];

            dbManagement.postUsers(query, cols, 'adding', users, db, res);
        });
    }

    remove(app, db) {
        app.post('/api/users/remove', auth.userAuthorised, (req, res) => {
            
            const users = utils.getUsersFromReq(req, res);
            if (!users) {
                return false;
            }

            const user = users[0]
            let cols = utils.getUsernameFromUser(user, res);
            if (!cols) {
                return false;
            }

            let query = 'DELETE FROM users WHERE username = ?';
            //let query = 'DELETE FROM stock.users WHERE username = ? AND EXISTS (SELECT username FROM ( SELECT username FROM stock.users WHERE id = ? AND privileges >= ?) AS tmp)';
            //cols = [...cols, req.session.userID, auth.PRIVILIGES_ADMIN];

            dbManagement.postUsers(query, cols, 'deleting', users, db, res);

        });
    }
}

module.exports = UsersRouter;