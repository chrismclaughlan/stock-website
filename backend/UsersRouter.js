const { json } = require('express');
const dbManagement = require('./DBManagement');
const utils = require('./Utils')
const auth = require('./Auth')

const {MAX_USERNAME_LEN, MAX_PASSWORD_LEN} = require('./SessionRouter');

class UsersRouter {

    constructor(app, db) {
        this.add(app, db);
        this.remove(app, db);
        this.update(app, db);
        this.changeMyPassword(app, db);
    }

    changeMyPassword(app, db) {
        app.post('/api/users/change-my-password', auth.userAuthenticated, (req, res) => {
            let query, cols = [];

            /* Validate and retreive POST data */

            if (! utils.validateRequest(req.body, ['users'], res)) return;
            const {users} = req.body;
            
            if (! utils.validateIsArray(users, res)) return;
            const user = users[0];

            if (! utils.validateRequest(user, ['password'], res)) return;
            let {password} = user;

            if (! auth.validatePasswordLength(password, res)) return;
            password = auth.hashPassword(password);  // trim()?

            /* Construct query */

            query = 'UPDATE users SET password = ? WHERE id = ?';
            cols = [password, req.session.userID];

            dbManagement.postUsers(query, cols, 'changing password', users, db, res);
        });
    }

    update(app, db) {
        app.post('/api/users/update', auth.userAuthorised, (req, res) => {
            let query, cols = [];

            /* Validate and retreive POST data */

            if (! utils.validateRequest(req.body, ['users'], res)) return;
            const {users} = req.body;

            if (! utils.validateIsArray(users, res)) return;
            const user = users[0];

            if (! utils.validateRequest(user, ['username'], res)) return;
            let {username, password, privileges} = user;

            if (! auth.validateUsernameLength(username, res)) return;
            username = username.trim().toLowerCase();

            /* Construct query */
            
            query = 'UPDATE users SET ';

            if (password) {
                if (! auth.validatePasswordLength(password, res)) return;
                password = auth.hashPassword(password);

                query += 'password = ?';
                cols.push(password);
            }

            if (privileges) {
                privileges = privileges.trim();

                if (cols.length > 0) {
                    query += ', ';
                }
                query += 'privileges = ?';
                cols.push(privileges);
            }

            if (cols.length === 0) {
                return res.json({
                    success: false,
                    msg: `Required field(s) (password or privileges) not defined`,
                })
            }

            query += ' WHERE username = ?';
            cols.push(username);

            //let query = 'UPDATE stock.users u, (select username from stock.users where id = ? AND privileges >= ?) a set u.password = ? where u.username = ?';
            //cols = [req.session.userID, auth.PRIVILIGES_ADMIN, ...cols];

            dbManagement.postUsers(query, cols, 'updating', users, db, res);
        });
    }

    add(app, db) {
        app.post('/api/users/add', auth.userAuthorised, (req, res) => {
            let query, cols = [];

            /* Validate and retreive POST data */

            if (! utils.validateRequest(req.body, ['users'], res)) return;
            const {users} = req.body;

            if (! utils.validateIsArray(users, res)) return;
            const user = users[0];

            if (! utils.validateRequest(user, ['username', 'password', 'privileges'], res)) return;
            let {username, password, privileges} = user;

            if (! auth.validateUsernameLength(username, res)) return;
            username = username.trim().toLowerCase();

            if (! auth.validatePasswordLength(password, res)) return;
            password = auth.hashPassword(password);

            privileges = privileges.trim();

            /* Construct query */

            query = 'INSERT INTO users(username, password, privileges) VALUES(?, ?, ?)';
            cols = [username, password, privileges];

            //let query = 'INSERT INTO users(password, username) SELECT ?, ?';
            //let tmpcols = [];
            //query = dbManagement.limitQueryByPrivileges(query, tmpcols, req.session.userID, auth.PRIVILIGES_ADMIN);
            //cols = [...cols, ...tmpcols];

            dbManagement.postUsers(query, cols, 'adding', users, db, res);
        });
    }

    remove(app, db) {
        app.post('/api/users/remove', auth.userAuthorised, (req, res) => {
            let query, cols = [];

            /* Validate and retreive POST data */

            if (! utils.validateRequest(req.body, ['users'], res)) return;
            const {users} = req.body;

            if (! utils.validateIsArray(users, res)) return;
            const user = users[0];

            if (! utils.validateRequest(user, ['username'], res)) return;
            let {username} = user;

            if (! auth.validateUsernameLength(username, res)) return;
            username = username.trim().toLowerCase();

            /* Construct query */

            query = 'DELETE FROM users WHERE username = ?';
            cols = [username];

            //let query = 'DELETE FROM stock.users WHERE username = ? AND EXISTS (SELECT username FROM ( SELECT username FROM stock.users WHERE id = ? AND privileges >= ?) AS tmp)';
            //cols = [...cols, req.session.userID, auth.PRIVILIGES_ADMIN];

            dbManagement.postUsers(query, cols, 'deleting', users, db, res);
        });
    }
}

module.exports = UsersRouter;