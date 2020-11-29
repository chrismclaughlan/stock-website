const PRIVILIGES_ADMIN = 1;

const userAuthenticated = (req, res, next) => {
    if (!userIsUser(req)) {
        return res.status(401).end();
    }

    next();
}

const userAuthorised = (req, res, next) => {
    if (!userIsUser(req)) {
        return res.status(401).end();
    }
    if (!userIsAdmin(req)) {
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

module.exports = {
    userAuthenticated, userAuthorised, userIsAdmin,
    PRIVILIGES_ADMIN,
};
