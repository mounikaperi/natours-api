const express = require('express');
const tourRouter = require('./src/routes/tourRouter');

const app = express();

// if (process.env.NODE_ENV === DEVELOPMENT) {
//   app.use(morgan);
// }

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
