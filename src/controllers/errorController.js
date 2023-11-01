/* eslint-disable node/no-unsupported-features/es-syntax */
const AppError = require('../utils/AppError');
const {
  HTTP_STATUS_CODES,
  AUTHENTICATION_ERRORS,
  ERROR,
  NODE_ENV,
  ERROR_TYPES,
} = require('../utils/constants');

const handleCastDBError = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(
    message,
    HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST,
  );
};

const handleDBDuplicateFields = (error) => {
  const value = error.errorMessage.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate Fields value: ${value}. Please use another value!`;
  return new AppError(
    message,
    HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST,
  );
};

const handleDBValidationError = (error) => {
  const errors = Object.values(error.errors).map(
    (currentError) => currentError.message,
  );
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(
    message,
    HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST,
  );
};

const handleJWTError = () =>
  new AppError(
    AUTHENTICATION_ERRORS.INVALID_TOKEN,
    HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.UNAUTHORIZED,
  );

const handleJWTExpiredError = () =>
  new AppError(
    AUTHENTICATION_ERRORS.EXPIRED_TOKEN,
    HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.UNAUTHORIZED,
  );

const sendErrorDev = (error, response) => {
  response.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (error, response) => {
  // Operational, trusted error: send message to client
  if (error.isOperational) {
    response.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    response
      .status(HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR)
      .json({
        status: error,
        message: AUTHENTICATION_ERRORS.DEFAULT,
      });
  }
};

const frameErrorMessagesBasedOnError = (error) => {
  let parsedError = { ...error };
  const { name: errorName } = parsedError || {};
  switch (errorName) {
    case ERROR_TYPES.CAST_ERROR:
      parsedError = handleCastDBError(parsedError);
      break;
    case ERROR_TYPES.DUPLICATES_ERROR:
      parsedError = handleDBDuplicateFields(parsedError);
      break;
    case ERROR_TYPES.VALIDATION_ERROR:
      parsedError = handleDBValidationError(parsedError);
      break;
    case ERROR_TYPES.JSONWEBTOKEN_ERROR:
      parsedError = handleJWTError();
      break;
    case ERROR_TYPES.TOKEN_EXPIRED_ERROR:
      parsedError = handleJWTExpiredError();
      break;
    default:
      break;
  }
  return parsedError;
};

module.exports = (error, request, response, next) => {
  let parsedError;
  error.statusCode =
    error.statusCode ||
    HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR;
  error.status = error.status || ERROR;
  switch (process.env.NODE_ENV) {
    case NODE_ENV.DEVELOPMENT:
      sendErrorDev(error, response);
      break;
    case NODE_ENV.PRODUCTION:
      parsedError = frameErrorMessagesBasedOnError(error);
      sendErrorProd(parsedError, response);
      break;
    default:
      break;
  }
};
