const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const tourRouter = require('./src/routes/tourRouter');
const userRouter = require('./src/routes/userRouter');
const { AUTHENTICATION_ERRORS } = require('./src/utils/constants');

const app = express();

// set Security HTTP Headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: AUTHENTICATION_ERRORS.TOO_MANY_REQUESTS,
});
app.use('/api', limiter);

// Body parser, reading data from body into request.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against Cross scripting sites xss
app.use(xss());

// Serving static file
app.use(express.static(`${__dirname}/public`));

// Test Middleware
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
app.use('/api/v1/users', userRouter);

module.exports = app;
