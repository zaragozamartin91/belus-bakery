const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('../config/main-config');
const basicAuthParser = require('../utils/basic-auth-parser');
const formidable = require('formidable');
const logger = require('log4js').getLogger();
const adminChecker = require('../middleware/admin-checker');

const title = "Belu's bakery";

module.exports = function (app) {
    const imagesDir = app.get('images'); /* /public/images */

    router.use(adminChecker.checkAdmin);

    router.get('/', (req, res) => {
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

    router.get('/image/upload', (req, res) => {
        res.render('admin-image-upload', { title, selected: 'image-upload' });
    });

    router.post('/image/upload', (req, res) => {
        const form = new formidable.IncomingForm();
        form.uploadDir = imagesDir;
        form.keepExtensions = true;
        form.maxFieldsSize = 2 * 1024 * 1024; // 2MB

        form.parse(req, (err, fields, files) => {
            console.log(files);
            res.send('Upload exitoso');
        });
    });

    return router;
};
