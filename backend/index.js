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
    let {username, similar, privileges} = req.query

    if (!req.session.userID) {
        res.send({
            successful: false, 
            msg: 'Not authorised',
        })

        return false;
    }

    // Check if admin?

    let cols;
    let QUERY = 'SELECT username FROM users';

    if (username !== undefined) {
        QUERY = QUERY + ' WHERE username';
        
        if (similar) {
            QUERY = QUERY + ` LIKE '${username}%'`;
        } else {
            QUERY = QUERY + ` = '${username}'`;
        }
        
        if (privileges !== undefined) {
            QUERY = QUERY + ` AND privileges >= '${privileges}'`;
        }
    } else {
        
        username = '';

        if (privileges !== undefined) {
            QUERY = QUERY + ` WHERE privileges >= '${privileges}'`;
        }
    }

    console.log(QUERY)

    let response
    db.query(QUERY, cols, function(err, results) {
        if (err) {
            console.log(err)
            return res.send({
                successful: false,
                query: {
                    string: username, 
                    similar,
                    privileges,
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
                    privileges,
                },
                results,
            }
        } else {
            response = {
                successful: false,
                query: {
                    string: username, 
                    similar,
                    privileges,
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
        return res.send({
            successful: false, 
            msg: 'Not authorised',
        })
    }

    if (name === undefined) {
        QUERY = 'SELECT * FROM parts';
    } else {
        if (similar) {
            QUERY = `SELECT * FROM parts WHERE name LIKE '${name}%'`;
        } else {
            QUERY = `SELECT * FROM parts WHERE name = '${name}'`;
        }
    }

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