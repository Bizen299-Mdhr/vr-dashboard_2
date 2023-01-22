const express = require('express');
require('module-alias/register');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const flash = require('connect-flash');
const path = require('path');
const helmet = require('helmet');
// const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const responseTime = require('response-time');
// const expressValidator = require('express-validator');
const {logApiRequest} = require('@lib');
const constantsConfig = require("../config");
const {redisClient} = require('../model/redis');
const {config} = require("../models");
let RedisStore = require('connect-redis')(session);
const {MAINSUPERADMIN} = require('@constant');
const errorHandler = require("@errorHandler");

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function () {
    console.log('Connected to redis successfully');
});


let expressLoader = {};
expressLoader.init = async (app) => {
    app.use(
        helmet.contentSecurityPolicy(
            {
                useDefaults: true,
                directives: {
                    "script-src": [
                        "'self'",  "'unsafe-inline'", "'unsafe-eval'",'*'
                    ],
                    imgSrc: ["'self'", "data:","*"],
                    connectSrc: ["*"]
                }
            }),
        helmet.hidePoweredBy(),
        helmet.frameguard(
            {
                action: "sameorigin"
            }),
        helmet.xssFilter(),
        helmet.noSniff(),
        helmet.hsts(
            {
                maxAge: 15552000,
                includeSubDomains: true
            })
    );
    app.use(compression());
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(express.static(path.join(__dirname, '../../public')));
    app.set('views', path.join(__dirname, '../views/backend'));
    app.set('view engine', 'ejs');
    require('../config/passport')(passport);

    if (constantsConfig.nodeEnv == "production") {        
        //app.use(morgan('dev'));  //log list
        app.set('view cache', true);
    }
    
    app.use(fileUpload());
    //Configure session middleware
    app.use(session({
        store: new RedisStore({client: redisClient, ttl: (constantsConfig.redisTTL * 1000)}),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.ENV_NODE !== "development", // if true only transmit cookie over https
            httpOnly: true, // if true prevent client side JS from reading the cookie
            maxAge: (constantsConfig.cookieMaxAge * 1000)// session max age in miliseconds
        }
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(cookieParser(process.env.COOKIE_SECRET, {httponly: true, domain: process.env.DOMAIN}));
    app.use(methodOverride('_method'));
    app.use(flash());

    // app.use(csrfProtection);
    app.use(async (req, res, next) => {
        if (!req.session.configData) {
            const configData = await config.findAll({attributes: ['name', 'value']});
            req.session.configData = JSON.parse(JSON.stringify(configData));
        }
        next();
    });

    app.use(async (req, res, next) => {
        res.locals['MAINSUPERADMIN'] = MAINSUPERADMIN;
        app.locals.csrfToken = '6hrFDATxrG9w14QY9wwnmVhLE0Wg6LIvwOwUaxz7';
        res.locals['error_msg'] = req.flash('error_msg');
        res.locals.inputData = req.flash('inputData')[0];
        res.locals['error_arr'] = req.flash('error_arr');
        res.locals['success_msg'] = req.flash('success_msg');
        res.locals.errors = req.flash('errors');
        res.locals.query = req.query;
        res.locals.url = req.url;
        res.locals.session = req.session;
        res.locals.configData = req.session?.configData || null;
        let none = "N/A";
        const nullValue = req.session.configData.filter(x=>x.name==='Null Field').map(x => x.value);
        res.locals.nil = nullValue[0] || none;

        next();
    });
    require('../routes')(app, passport);
    
    app.use(errorHandler);

    app.use(responseTime(async (request, response, time) => {
        if (response.statusCode === 200) {
            logApiRequest(request, response, time, '');
        }
    }));
};

module.exports = expressLoader;