const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('../config/main-config');
const logger = require('log4js').getLogger();

router.get('/', (req, res) => {
    res.redirect(config.mainPath);
});

/* GET home page. */
router.get(config.mainPath, (req, res) => {
    logger.debug('HEEEYYY');
    res.render('index', { title: `Belu's bakery`, selected:'main' });
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect(config.mainPath);
});

router.get('/recipes', (req, res) => {
    res.render('recipes', { title: `Belu's bakery` , selected:'recipes' });
});

router.get('/contact', (req, res) => {
    res.render('contact', { title: `Belu's bakery` , selected:'contact' });
});

router.get('/admin', (req, res) => {
    res.render('admin', { title: `Belu's bakery` , selected:'admin' });
});

module.exports = router;
