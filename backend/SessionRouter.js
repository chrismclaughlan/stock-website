const bcrypt = require('bcrypt');
const { json } = require('express');

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
                            console.log(bcryptErr);
                            throw bcryptErr;
                        }

                        if (verified) {
                            req.session.userID = data[0].id;

                            res.json({
                                success: true,
                                username: data[0].username
                            })

                            console.log(`'${username}' logged in`)

                            return;
                        }
                        else {
                            res.json({
                                success: false,
                                msg: 'Wrong password, please try again'
                            })
                        }
                    });
                }
                else {
                    res.json({
                        success: false,
                        msg: 'User not found, please try again'
                    })
                }
            });
            
        });
    }

    logout(app, db) {
        app.post('/logout', (req, res) => {

            if (req.session && req.session.userID && req.session.userID !== undefined) {
                req.session.destroy();
                return res.json({
                    success: true
                })
            } else {
                return res.json({
                    success: false
                })
            }
        });
    }

    isLoggedIn(app, db) {

        app.post('/isLoggedIn', (req, res) => {

            if (req.session && req.session.userID && req.session.userID !== undefined) {

                let cols = [req.session.userID];
                db.query('SELECT * FROM users WHERE id = ? LIMIT 1', cols, (err, data, fields) => {
                    if (data && data.length === 1) {
                        res.json({
                            success: true,
                            username: data[0].username
                        })

                        return true;
                    } else {
                        res.json({
                            success: false
                        })
                    }
                });
            } else {
                res.json({
                    success: false
                })
            }
        });
    }
}

module.exports = SessionRouter;