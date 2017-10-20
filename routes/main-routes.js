const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('../config/main-config');
const basicAuthParser = require('../utils/basic-auth-parser');
const formidable = require('formidable');
const logger = require('log4js').getLogger();

const title = `Belu's bakery`;

module.exports = function (app) {
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

    return router;
};
