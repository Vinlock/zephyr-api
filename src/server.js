require('babel-polyfill');
require('babel-register');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const validator = require('express-validator');
const APIError = require('./utils/APIError');
const router = require('./router');
const authorizeMiddleware = require('./middleware/authorize');
const responseTime = require('response-time');

const app = express();

app.use(responseTime());

app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Zephyr Engine 1.0');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(mongoSanitize());

app.use(cors({
  exposedHeaders: [
    'X-Authenticated',
  ]
}));

app.use(authorizeMiddleware());

app.use(validator());

app.use(router);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof APIError) {
    if (err.errorCode === 'INTERNAL_ERROR') {
      res.status(500);
    } else {
      res.status(200);
    }
    res.json({
      error: {
        errorCode: err.errorCode,
        errorDesc: err.errorDesc,
        csCode: err.csCode,
      },
    });
  }
});

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`App is running on ${port}!`));
