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
const utils = require('./Utils');
const dbManagement = require('./DBManagement');

const result = dotenv.config();
if (result.error) {
    utils.printMessage('index.js', 'DOTENV ERROR', result.error, 'reading .config()');
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
    dateStrings: true,
});

db.connect(function(err) {
    if (err)
    {
        utils.printMessage('index.js', 'MYSQL ERROR', err, 'connecting');
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

    if (!utils.authoriseUser(req, res)) {
        return false;
    }

    // Check if admin?

    let cols = [];
    let query = 'SELECT username FROM users';

    if (username !== undefined) {
        query = query + ' WHERE username';
        
        if (similar) {
            query = query + ` LIKE ?`;
            cols.push(username + '%');
        } else {
            query = query + ` = ?`;
            cols.push(username);
        }
        
        if (privileges !== undefined) {
            query = query + ` AND privileges >= ?`;
            cols.push(privileges);
        }
    } else {
        
        username = '';

        if (privileges !== undefined) {
            query = query + ` WHERE privileges >= ?`;
            cols.push(privileges);
        }
    }

    queryReq =  {
        string: username, 
        similar,
        privileges,
    },
    dbManagement.getUsers(query, cols, queryReq, db, res);
})

app.get('/api/parts', function(req, res) {
    const {name, similar} = req.query;
    
    if (!utils.authoriseUser(req, res)) {
        return false;
    }

    let query;
    let cols = []
    if (name === undefined) {
        query = 'SELECT * FROM parts';
    } else {
        if (similar) {
            query = `SELECT * FROM parts WHERE name LIKE ?`;
            cols.push(name + '%');
        } else {
            query = `SELECT * FROM parts WHERE name = ?`;
            cols.push(name);
        }
    }

    query = query + ' ORDER BY id DESC';
    
    const queryReq = {
        string: name,
        similar,
    }
    dbManagement.getParts(query, cols, queryReq, db, res);
});

app.get('/api/mylogs', function(req, res) {
    if (!utils.authoriseUser(req, res)) {
        return false;
    }

    const query = 'SELECT * FROM parts_logs WHERE user_id = ? ORDER BY date DESC';
    const cols = [req.session.userID];
    dbManagement.getLogs(query, cols, null, db, res);
})

app.get('/api/logs', function(req, res) {
    const {username, similar} = req.query;  // part_name?
    
    if (!utils.authoriseAdmin(req, res)) {
        return false;
    }

    let query;
    let cols = []
    if (username === undefined) {
        query = 'SELECT * FROM parts_logs';
    } else {
        if (similar) {
            query = `SELECT * FROM parts_logs WHERE user_username LIKE ?`;
            cols.push(username + '%');
        } else {
            query = `SELECT * FROM parts_logs WHERE user_username = ?`;
            cols.push(username);
        }
    }

    query = query + ' ORDER BY date DESC';
    
    const queryReq = {
        string: username,
        similar,
    }
    dbManagement.getLogs(query, cols, queryReq, db, res);
});

const port = 4000;
app.listen(port, () => {
    utils.printMessage('index.js', 'READY', `Listening on http://localhost:${port}`)
});