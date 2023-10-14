/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");
const morgan = require("morgan");
const { DEVELOPMENT } = require("./src/utils/constants");
const tourRouter = require("./src/routes/tourRouter");

const app = express();

if (process.env.NODE_ENV === DEVELOPMENT) {
  app.use(morgan);
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((request, response, next) => {
  console.log("Hello from middleware");
  next();
});

app.use((request, response, next) => {
  request.requestTime = new Date().toISOString();
});

app.use("/api/v1/tours", tourRouter);

module.exports = app;
