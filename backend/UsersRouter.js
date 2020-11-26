const bcrypt = require('bcrypt');
const { json } = require('express');

const getUsersFromReq = (req, res) => {
    const {users} = req.body;

    if (users === undefined || !(users.length > 0)) {
        res.json({
            success: false,
            msg: 'Error parsing request: users not defined'
        })
        return null;
    }

    return users;
}

const getUsernameFromUser = (user, res) => {
    let {username} = user;

    if (username === undefined || !(username.length > 0)) {
        res.json({
            success: false,
            msg: 'Error parsing request: Username of user not defined'
        })
        return null;
    }

    username = username.trim();
    username = username.toLowerCase()
    return [username];
}


const getPasswordUsernameFromUser = (user, res) => {
    let {username, password} = user;

    if (username === undefined || !(username.length > 0) || password === undefined || !(password.length > 0)) {
        res.json({
            success: false,
            msg: 'Error parsing request: Username or password of user not defined'
        })
        return null;
    }

    username = username.trim();
    username = username.toLowerCase()
    return [password, username];
}

const queryUsers = (query, cols, verbMsg, users, db, res) => {
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

            console.log(`Error ${verbMsg} user: {Errno: ${err.errno}. Code: ${err.code}}`)

            res.json({
                success: false,
                query: parts,
                msg: `Error ${verbMsg} user: ${message}`
            })
            return false;
        }

        if (data.affectedRows <= 0) {
            res.json({
                success: false,
                query: users,
                msg: `Error ${verbMsg} user: User doesn't exist`
            })
            return false;
        }

        res.json({
            success: true,
            query: users,
        })
        return true;
    });
}

class UsersRouter {

    constructor(app, db) {
        this.add(app, db)
        this.remove(app, db)
        this.update(app, db)
    }

    update(app, db) {
        app.post('/api/users/update', (req, res) => {
            
            const users = getUsersFromReq(req, res);
            if (!users) {
                return false;
            }

            const user = users[0];
            const cols = getPasswordUsernameFromUser(user, res);
            if (!cols) {
                return false;
            }
            
            const query = 'UPDATE users SET password = ? WHERE username = ?';
            return queryUsers(query, cols, 'updating', users, db, res);
        });
    }

    add(app, db) {
        app.post('/api/users/add', (req, res) => {
            
            const users = getUsersFromReq(req, res);
            if (!users) {
                return false;
            }

            const user = users[0]
            const cols = getPasswordUsernameFromUser(user, res);
            if (!cols) {
                return false;
            }
            
            const query = 'INSERT INTO users(password, username) VALUES(?, ?)';
            return queryUsers(query, cols, 'adding', users, db, res);
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

            const users = getUsersFromReq(req, res);
            if (!users) {
                return false;
            }

            const user = users[0]
            const cols = getUsernameFromUser(user, res);
            if (!cols) {
                return false;
            }

            const query = 'DELETE FROM users WHERE username = ?';
            return queryUsers(query, cols, 'deleting', users, db, res);

        });
    }
}

module.exports = UsersRouter;