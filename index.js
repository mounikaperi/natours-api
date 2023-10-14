/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");
const morgan = require("morgan");

const { DEVELOPMENT } = require("./src/utils/constants");

const app = express();

if (process.env.NODE_ENV === DEVELOPMENT) {
  app.use(morgan);
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log("Hello from middleware");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
});

module.exports = app;
