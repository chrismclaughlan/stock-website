const PRIVILIGES_ADMIN = 1;

const userAuthenticated = (req, res, next) => {
    if (!req.session.userID) {
        res.status(401).end();
        return;
    }

    next();
}

// const userIsAdmin = (req, res, next) => {
//     console.log(`priv:${req.session.privileges}`);
//     if (!req.session.userID) {
//         res.status(401).end();
//         return;
//     }
//     else if (!req.session.privileges || !(req.session.privileges >= 1)) {
//         res.status(403).end();
//         return;
//     }
    
//     next();
// }

module.exports = {
    userAuthenticated,
    PRIVILIGES_ADMIN,
};
