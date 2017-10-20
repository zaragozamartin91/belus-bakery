const basicAuthParser = require('../utils/basic-auth-parser');

exports.checkAdmin = function(req, res, next) {
    if (req.session.ok) return next();

    const basicAuth = basicAuthParser.parse(req);
    console.log(basicAuth);
    const { user, pass } = basicAuth;
    if ('belen' == user && 'belen' == pass) {
        req.session.ok = true;
        return next();
    }

    res.status(401);
    res.setHeader('WWW-Authenticate', 'Basic');
    res.send('Autenticarse');
};