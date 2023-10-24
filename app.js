const express = require('express');
const rateLimit = require('express-rate-limit');
const tourRouter = require('./src/routes/tourRouter');
const { AUTHENTICATION_ERRORS } = require('./src/utils/constants');

const app = express();

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: AUTHENTICATION_ERRORS.TOO_MANY_REQUESTS,
});
app.use('/api', limiter);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`The request was hit at ${req.requestTime}`);
  next();
});

app.use('/api/v1/tours', tourRouter);

module.exports = app;
