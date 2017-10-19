const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('../config/main-config');
const basicAuthParser = require('../utils/basic-auth-parser');
const logger = require('log4js').getLogger();

const title = `Belu's bakery`;

router.get('/', (req, res) => {
    res.redirect(config.mainPath);
});

/* GET home page. */
router.get(config.mainPath, (req, res) => {
    logger.debug('HEEEYYY');
    res.render('index', { title, selected: 'main' });
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect(config.mainPath);
});

router.get('/recipes', (req, res) => {
    res.render('recipes', { title, selected: 'recipes' });
});

router.get('/contact', (req, res) => {
    res.render('contact', { title, selected: 'contact' });
});

router.get('/admin', (req, res) => {
    if (req.session.ok) return res.render('admin', { title, selected: 'admin' });

    const basicAuth = basicAuthParser.parse(req);
    console.log(basicAuth);
    const { user, pass } = basicAuth;
    if ('belen' == user && 'belen' == pass) {
        req.session.ok = true;
        return res.render('admin', { title, selected: 'admin' });
    }

    res.status(401);
    res.setHeader('WWW-Authenticate', 'Basic');
    res.send('Autenticarse');
});

module.exports = router;
