const { json } = require('express');
const dbManagement = require('./DBManagement');
const utils = require('./Utils')

class UsersRouter {

    constructor(app, db) {
        this.add(app, db);
        this.remove(app, db);
        this.update(app, db);
        this.changeMyPassword(app, db);
    }

    changeMyPassword(app, db) {
        app.post('/api/users/change-my-password', (req, res) => {
            
            if (!utils.authoriseUser(req, res)) {
                return false;
            }
            
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
        app.post('/api/users/update', (req, res) => {

            if (!utils.authoriseUser(req, res)) {
                return false;
            }
            
            const users = utils.getUsersFromReq(req, res);
            if (!users) {
                return false;
            }

            const user = users[0];
            let cols = utils.getPasswordUsernameFromUser(user, res);
            if (!cols) {
                return false;
            }

            let query = 'UPDATE stock.users u, (select username from stock.users where id = ? AND privileges >= ?) a set u.password = ? where u.username = ?';
            cols = [req.session.userID, 1, ...cols];

            console.log(query)
            console.log(cols)
            
            dbManagement.postUsers(query, cols, 'updating', users, db, res);
        });
    }

    add(app, db) {
        app.post('/api/users/add', (req, res) => {
            
            if (!utils.authoriseUser(req, res)) {
                return false;
            }
            
            const users = utils.getUsersFromReq(req, res);
            if (!users) {
                return false;
            }

            const user = users[0]
            let cols = utils.getPasswordUsernameFromUser(user, res);
            if (!cols) {
                return false;
            }

            let query = 'INSERT INTO users(password, username) SELECT ?, ?';
            let tmpcols = [];
            query = dbManagement.limitQueryByPrivileges(query, tmpcols, req.session.userID, 1);
            cols = [...cols, ...tmpcols];

            dbManagement.postUsers(query, cols, 'adding', users, db, res);
        });
    }

    remove(app, db) {
        app.post('/api/users/remove', (req, res) => {

            if (!utils.authoriseUser(req, res)) {
                return false;
            }
            
            const users = utils.getUsersFromReq(req, res);
            if (!users) {
                return false;
            }

            const user = users[0]
            let cols = utils.getUsernameFromUser(user, res);
            if (!cols) {
                return false;
            }

            let query = 'DELETE FROM stock.users WHERE username = ? AND EXISTS (SELECT username FROM ( SELECT username FROM stock.users WHERE id = ? AND privileges >= ?) AS tmp)';
            cols = [...cols, req.session.userID, 1];

            dbManagement.postUsers(query, cols, 'deleting', users, db, res);

        });
    }
}

module.exports = UsersRouter;