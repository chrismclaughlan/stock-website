const bcrypt = require('bcrypt');
const { json } = require('express');
const auth = require('./Auth');
const utils = require('./Utils');

const {CONSOLE_RED, CONSOLE_YELLOW, CONSOLE_GREEN} = utils;

class SessionRouter {

    constructor(app, db) {
        this.login(app, db);
        this.logout(app, db);
        this.isLoggedIn(app, db);
    }

    login(app, db) {
        app.post('/login', (req, res) => {
            let username = req.body.username;
            let password = req.body.password;

            if (username === undefined || password === undefined) {
                return res.json({
                    success: false,
                    msg: 'An error occured'
                })
            }

            username = username.toLowerCase();

            if (username.length > 12 || password.length > 12) {
                return res.json({
                    success: false,
                    msg: 'An error occured'
                })
            }

            let cols = [username];
            db.query('SELECT * FROM users WHERE username = ? LIMIT 1', cols, (err, data, fields) => {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'An error occured, please try again'
                    })
                    return;
                }

                // Found 1 user with this username
                if (data && data.length === 1) {
                    bcrypt.compare(password, data[0].password, (bcryptErr, verified) => {
                        if (bcryptErr) {
                            utils.printMessage(CONSOLE_RED, 'SESSION', 'BCRYPT ERROR', bcryptErr, `username: ${username}`);
                            throw bcryptErr;
                        }

                        if (verified) {
                            req.session.userID = data[0].id;
                            req.session.privileges = data[0].privileges;

                            res.json({
                                success: true,
                                username: data[0].username,
                                privileges: data[0].privileges,
                            })

                            if (utils.PRINT_DEBUG_SUCCESS) {
                                utils.printMessage(CONSOLE_GREEN, 'SESSION', 'SUCCESS', `Username: ${username}`, 'logged in');
                            }

                            return;
                        }
                        else {
                            res.json({
                                success: false,
                                passwordIncorrect: true,
                                msg: 'Wrong password, please try again'
                            })
                        }
                    });
                }
                else {
                    res.json({
                        success: false,
                        usernameIncorrect: true,
                        msg: 'User not found, please try again'
                    })
                }
            });
            
        });
    }

    logout(app, db) {
        app.post('/logout', auth.userAuthenticated, (req, res) => {
            req.session.destroy();

            if (utils.PRINT_DEBUG_SUCCESS) {
                utils.printMessage(CONSOLE_GREEN, 'SESSION', 'SUCCESS', `userID: ${req.session.userID}`, 'logged out');
            }

            res.json({
                success: true
            });
        });
    }

    isLoggedIn(app, db) {

        app.post('/isLoggedIn', (req, res) => {

            if (!req.session || !req.session.userID) {
                res.json({
                    success: false
                })
                return;
            }

            let cols = [req.session.userID];
            db.query('SELECT * FROM users WHERE id = ? LIMIT 1', cols, (err, data, fields) => {
                if (data && data.length === 1) {
                    res.json({
                        success: true,
                        username: data[0].username,
                        privileges: data[0].privileges,
                    })

                    return true;
                } else {
                    res.json({
                        success: false
                    })
                }
            });
        });
    }
}

module.exports = SessionRouter;