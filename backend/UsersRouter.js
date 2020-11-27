const { json } = require('express');
const dbManagement = require('./DBManagement');
const utils = require('./Utils')

class UsersRouter {

    constructor(app, db) {
        this.add(app, db);
        this.remove(app, db);
        this.update(app, db);
        this.changePassword(app, db);
    }

    changePassword(app, db) {
        app.post('/api/users/change-password', (req, res) => {
            
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
            
            const users = utils.getUsersFromReq(req, res);
            if (!users) {
                return false;
            }

            const user = users[0];
            const cols = utils.getPasswordUsernameFromUser(user, res);
            if (!cols) {
                return false;
            }
            
            const query = 'UPDATE users SET password = ? WHERE username = ?';
            dbManagement.postUsers(query, cols, 'updating', users, db, res);
        });
    }

    add(app, db) {
        app.post('/api/users/add', (req, res) => {
            
            const users = utils.getUsersFromReq(req, res);
            if (!users) {
                return false;
            }

            const user = users[0]
            const cols = utils.getPasswordUsernameFromUser(user, res);
            if (!cols) {
                return false;
            }

            const query = 'INSERT INTO users(password, username) VALUES(?, ?)';
            dbManagement.postUsers(query, cols, 'adding', users, db, res);
        });
    }

    // addPart(app, db, part) {
    //     // Todo: Iterate over list of parts to add... from add()
    // }
    
    // removePart(app, db, part) {
    //     // Todo: Iterate over list of parts to delete... from remove()
    // }
    
    remove(app, db) {
        app.post('/api/users/remove', (req, res) => {

            const users = utils.getUsersFromReq(req, res);
            if (!users) {
                return false;
            }

            const user = users[0]
            const cols = utils.getUsernameFromUser(user, res);
            if (!cols) {
                return false;
            }

            const query = 'DELETE FROM users WHERE username = ?';
            dbManagement.postUsers(query, cols, 'deleting', users, db, res);

        });
    }
}

module.exports = UsersRouter;