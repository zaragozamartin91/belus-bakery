const express = require('express');
const path = require('path');
const fs = require('fs');
const favicon = require('serve-favicon');
const log4js = require('log4js');
const bodyParser = require('body-parser');
const session = require('express-session');

const mainRoutes = require('./routes/main-routes');
const adminRoutes = require('./routes/admin-routes');
const mainConf = require('./config/main-config');


/* ------------------------------------------------------------------------------------------- */

const app = express();
// TODO falta configurar usar sesiones con BBDD
app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: 'Belus bakery',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 1000 * 60 * 30 }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('images', path.join(__dirname, 'public', 'images'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

/* CONFIGURACION DE LOGS ------------------------------------------------------------------------ */

const logDirectory = path.join(__dirname, 'log');

// Verificamos que el directorio log/ exista
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory);

log4js.configure(path.join(__dirname, 'config', 'log4js.json'));
app.use(log4js.connectLogger(log4js.getLogger('http'), { level: 'auto' }));

/* CONFIGURACION DE MIDDLEWARE DE PARSEO DE BODY ------------------------------------------------------------------------ */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* CONFIGURACION DE PATHS -------------------------------------------------------------------------- */

/* LOS RECURSOS ESTATICOS DEBEN ACCEDERSE USANDO EL PATH APROPIADO. 
NO ES POSIBLE NAVEGARLOS COMO ESTRUCTURA DE DIRECTORIO */
app.use(express.static('public'));

/* RUTAS */
app.use('/', mainRoutes(app));
app.use('/admin', adminRoutes(app));

/* MANEJO DE ERRORES ------------------------------------------------------------------------------ */

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    console.log('DEVELOPMENT ENVIRONMET ENABLED');
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

/* La instruccion del puerto fue modificada para hacer un deploy correcto 
de la app en heroku. https://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of */
const port = process.env.PORT || 5000;
console.log(`ESCUCHANDO EN PUERTO ${port}`);
console.log('Version API: 1');
app.listen(port);
