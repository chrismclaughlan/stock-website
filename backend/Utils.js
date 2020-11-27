
const bcrypt = require('bcrypt');

const printMessage = (area, type, content, action) => {
    console.log(`[${area}] - ${type}${(action !== undefined) ? ` while ${action}` : ''} - ${content}`)
}

const authoriseUser = (req, res) => {
    if (!req.session.userID) {
        res.json({
            successful: false, 
            msg: 'Not authorised',
        })
        return false;
    }

    return true;
}

const authoriseAdmin = (req, res) => {

    if (!req.session.userID) {
        res.json({
            successful: false, 
            msg: 'Not authorised',
        })
        return false;
    }

    // TODO
    // const QUERY = `SELECT username FROM users WHERE id = '${req.session.userID}'`;
    // db.query()

    return true;
}


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

const getPasswordUserIDFromUser = (user, req, res) => {
    let {password} = user;

    if (password === undefined || !(password.length > 0)) {
        res.json({
            success: false,
            msg: 'Error parsing request: Password of user not defined'
        })
        return null;
    }

    if (!req.session || !req.session.userID) {
        res.send({
            successful: false, 
            msg: 'Not authorised',
        })

        return null;
    }

    password = bcrypt.hashSync(password, 9);

    return [password, req.session.userID];
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

    password = bcrypt.hashSync(password, 9);

    return [password, username];
}


const getQuantityNameFromPart = (part, res) => {
    let {name, quantity} = part;

    if (name === undefined || !(name.length > 0) || quantity === undefined) {
        res.json({
            success: false,
            msg: 'Error parsing request: Suitable element(s) of part not defined'
        })
        return null;
    }

    name = name.trim();
    name = name.toLowerCase()
    return [quantity, name];
}

const getNameFromPart = (part, res) => {
    let {name} = part;

    if (name === undefined || !(name.length > 0)) {
        res.json({
            success: false,
            msg: 'Error parsing request: Name of part not defined'
        })
        return null;
    }

    name = name.trim();
    name = name.toLowerCase()
    return name;
}

const getPartsFromReq = (req, res) => {
    const {parts} = req.body;

    if (parts === undefined || !(parts.length > 0)) {
        res.json({
            success: false,
            msg: 'Error parsing request: parts not defined'
        })
        return null;
    }

    return parts;
}

const getColsFromPart = (part, res) => {
    let {name, quantity, bookcase, shelf} = part;

    if (name === undefined || !(name.length > 0) || 
        quantity === undefined || 
        bookcase === undefined || 
        shelf === undefined
        ) {
        res.json({
            success: false,
            msg: 'Error parsing request: Suitable element(s) of part not defined'
        })
        return null;
    }

    name = name.trim();
    name = name.toLowerCase()
    return [quantity, bookcase, shelf, name];
};

module.exports = {
    printMessage, getPartsFromReq, getNameFromPart, getColsFromPart,
    getQuantityNameFromPart, authoriseAdmin, authoriseUser, getPasswordUsernameFromUser,
    getUsersFromReq, getUsernameFromUser, getPasswordUserIDFromUser,
};
