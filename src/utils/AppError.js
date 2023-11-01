const { HTTP_STATUS } = require('./constants');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4')
      ? HTTP_STATUS.FAIL
      : HTTP_STATUS.SUCCESS;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
