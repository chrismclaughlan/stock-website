const bcrypt = require('bcrypt');

const PRIVILIGES_ADMIN = 1;
const MAX_USERNAME_LEN = 20;
const MAX_PASSWORD_LEN = 20;

const userAuthenticated = (req, res, next) => {
    if (! userIsUser(req)) {
        return res.status(401).end();
    }

    next();
}

const userAuthorised = (req, res, next) => {
    if (! userIsUser(req)) {
        return res.status(401).end();
    }
    if (! userIsAdmin(req)) {
        return res.status(403).end();
    }

    next();
}

const userIsUser = (req) => {
    return (req.session && req.session.userID);
}

const userIsAdmin = (req) => {
    return (req.session && req.session.privileges && req.session.privileges >= PRIVILIGES_ADMIN);
}

const hashPassword = (raw) => {
    return bcrypt.hashSync(raw, 9);
}

const validateUsernameLength = (username, res) => {
    
    if (username.length > MAX_USERNAME_LEN) {
        res.send({
            successful: false, 
            msg: `Username exceeds max length (${MAX_USERNAME_LEN})`,
        }).end();
        return false;
    }

    return true;
}

const validatePasswordLength = (password, res) => {

    if (password.length > MAX_PASSWORD_LEN) {
        res.send({
            successful: false, 
            msg: `Password exceeds max length (${MAX_PASSWORD_LEN})`,
        }).end();
        return false;
    }

    return true;
}

module.exports = {
    userAuthenticated, userAuthorised, userIsAdmin, userIsUser, hashPassword,
    validateUsernameLength, validatePasswordLength,

    // Constants
    PRIVILIGES_ADMIN, MAX_USERNAME_LEN, MAX_PASSWORD_LEN,
};
