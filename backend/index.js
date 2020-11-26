const dotenv = require('dotenv');
const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const SessionRouter = require('./SessionRouter');
const PartsRouter = require('./PartsRouter');
const UsersRouter = require('./UsersRouter');

const result = dotenv.config();
if (result.error) {
    throw result.error;
}

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(express.json());

const YEAR_IN_MS = (1000 * 86400 * 365);

// Database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

db.connect(function(err) {
    if (err)
    {
        console.log(`Error connecting to database: ${err}`);
        throw err;
    }
});

const sessionStore = new MySQLStore({
    epiration: YEAR_IN_MS,
    endConnectionOnCLose: false,
}, db);

app.use(session({
    key: 'userID',
    secret: process.env.SESSION_SECRET,  // Keep secret and randomise
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: YEAR_IN_MS,
        httpOnly: false
    }
}));

new SessionRouter(app, db);
new PartsRouter(app, db);
new UsersRouter(app, db);

app.get('/', function(req, res) {
    res.send(path.join(__dirname, 'build', 'index.html'));
});

app.get('/api/users', function(req, res) {
    console.log(req.query)
    let {username, similar} = req.query
    let QUERY

    if (!req.session.userID) {
        return res.send({
            successful: false, 
            notAuthorised: true,
        })
    }

    // Check if admin?

    if (username === undefined) {
        QUERY = 'SELECT username FROM users'
        username = false
    } else if (similar) {
        QUERY = `SELECT username FROM users WHERE username LIKE '${username}%'`
    } else {
        QUERY = `SELECT username FROM users WHERE username = '${username}'`
    }

    console.log(QUERY)

    let response
    db.query(QUERY, function(err, results) {
        if (err) {
            console.log(err)
            return res.send({
                successful: false,
                query: {
                    string: username, 
                    similar,
                },
                error: err,
            })
        }

        if (results && results.length > 0)
        {
            response = {
                successful: true,
                query: {
                    string: username, 
                    similar,
                },
                results,
            }
        } else {
            response = {
                successful: false,
                query: {
                    string: username, 
                    similar,
                },
            }
        }

        return res.send(response)
    });
})

app.get('/api/parts', function(req, res) {
    const {name, similar} = req.query;
    let QUERY;

    if (!req.session.userID) {
        res.send({
            successful: false, 
            notAuthorised: true,
        })
        return false;
    }

    if (name === undefined) {
        QUERY = 'SELECT * FROM parts';
    } else if (similar){
        QUERY = `SELECT * FROM parts WHERE name LIKE '${name}%'`;
    } else {
        QUERY = `SELECT * FROM parts WHERE name = '${name}'`;
    }

    let response;
    return db.query(QUERY, (err, results) => {
        if (err) {
            console.log(err)
            res.send({
                successful: false,
                error: err,
            })
            return false;
        }

        if (results && results.length > 0)
        {
            res.send({
                successful: true,
                query: {
                    string: name, 
                    similar,
                },
                results,
            });
            return true;
            
        } else {
            res.send({
                successful: false,
                query: {
                    string: name, 
                    similar,
                },
            });
            return false;
        }
    });
});

const port = 4000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});