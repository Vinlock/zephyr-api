require('dotenv').config();
require('babel-polyfill');
require('babel-register');
require('./db');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const validator = require('express-validator');
const APIError = require('./utils/APIError');
const router = require('./router');
const responseTime = require('response-time');
const session = require('express-session');
// const store = require('./lib/mongoSessionStore')(session);
const loggingMiddleware = require('./middleware/logger');
const requestIdMiddleware = require('./middleware/requestIdGenerator');
const logRequestMiddleware = require('./middleware/logRequest');
const axiosMiddleware = require('./middleware/axios');
const passport = require('passport');
const cookieParser = require('cookie-parser');

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(axiosMiddleware());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' },
  // store: store,
}));

app.use(loggingMiddleware());
app.use(requestIdMiddleware());
app.use(logRequestMiddleware());

app.use(passport.initialize());
app.use(passport.session());

app.use(responseTime());

app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Zephyr Engine 1.0');
  return next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(mongoSanitize());

app.use(validator());

app.use(router);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof APIError) {
    if (err.statusCode) {
      res.status(err.statusCode);
    } else {
      res.status(500);
    }
    return res.json({
      error: {
        errorCode: err.errorCode,
        errorDesc: err.errorDesc,
        csCode: err.csCode,
      },
    });
  } else if (err instanceof Error) {
    console.error(err);
    return res.status(500).json({
      error: {
        errorCode: err.message,
        errorDesc: null,
        csCode: null,
        errorStack: err.stack,
      },
    });
  } else {
    console.error(err);
    throw new Error('INTERNAL_ERROR');
  }
});

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`App is running on ${port}!`));
