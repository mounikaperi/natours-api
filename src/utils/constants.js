exports.TOUR_SCHEMA_VALIDATION_ERRORS = {
  NAME: 'A tour must have a name',
  NAME_MAX_LENGTH: 'A tour name must have less than or equal to 40 characters',
  NAME_MIN_LENGTH: 'A tour name must have more or equal to 10 characters',
  DURATION: 'A tour must have duration',
  MAX_GROUP_SIZE: 'A tour must have a group size',
  DIFFICULTY: 'A tour must have a difficulty',
  DIFFICULTY_LEVEL: 'Difficulty is either: easy, medium, difficult',
  RATING_MIN_VALUE: 'Rating must be above 1.0',
  RATING_MAX_VALUE: 'Rating must be below 5.0',
  PRICE: 'A tour must have a price',
  SUMMARY: 'A tour must have a summary',
  COVER_IMAGE: 'A tour must have a cover image',
};

exports.USER_SCHEMA_VALIDATION_ERRORS = {
  NAME: 'Please enter your name',
  EMAIL: 'Please enter your emailId',
  VALID_EMAIL: 'Please enter a valid email',
  PASSWORD: 'Please provide a password',
  CONFIRM_PASSWORD: 'Please confirm your password',
};

exports.REVIEW_SCHEMA_VALIDATION_ERRORS = {
  NO_REVIEW: 'Review cannot be empty!!',
  TOUR_REVIEW: 'Review must belong to a tour',
  USER_REVIEW: 'Review must belong to a user',
};

exports.AUTHENTICATION_ERRORS = {
  MISSING_EMAIL_PASSWORD: 'Please provide email and password',
  INVALID_EMAIL_PASSWORD: 'Incorrect email or password',
  NOT_LOGGED_IN: 'You are not logged in!!! Please login to get access',
  INVALID_TOKEN: 'Invalid Token. Please login again',
  EXPIRED_TOKEN: 'Your token has expired! Please log in again',
  INVALID_OR_EXPIRED_TOKEN: 'Token is invalid or has expired',
  NO_USER_FOR_TOKEN: 'The user belonging to this token no longer exists!!',
  NO_USER_FOR_EMAIL: 'There is no user with the entered email address!!',
  PASSWORD_CHANGED: 'User recently changed password! Please login again',
  WRONG_PASSWORD: 'The password you entered is wrong!!',
  NO_PERMISSION: 'You do not have permission to perform this action',
  RESET_PASSWORD:
    'Forgot your password? Submit a PATCH request with your new password and passwordConfirm',
  IGNORE_PASSWORD_RESET_EMAIL:
    'If you didnt forget your password, please ignore this email!',
  TOKEN_SENT_TO_EMAIL: 'Token sent to email!!!',
  SEND_EMAIL_FAIL: 'There was an error sending the email. Try again later!!!',
  NOT_A_PASSWORD_ROUTE: 'This route is not for password updates',
  TOO_MANY_REQUESTS:
    'Too many requests from this IP, please try again in an hour!!!',
  DEFAULT: 'Something went very wrong!',
};

exports.ERROR = 'error';

exports.NODE_ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};

exports.ERROR_TYPES = {
  CAST_ERROR: 'CastError',
  DUPLICATES_ERROR: 11000,
  VALIDATION_ERROR: 'ValidationError',
  JSONWEBTOKEN_ERROR: 'JsonWebTokenError',
  TOKEN_EXPIRED_ERROR: 'TokenExpiredError',
};

exports.HTTP_STATUS_CODES = {
  SUCCESSFUL_RESPONSE: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    PARTIAL_CONTENT: 206,
  },
  CLIENT_ERROR_RESPONSE: {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
  },
  SERVER_ERROR_RESPONSE: {
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    SERVICE_UNAVAILABLE: 503,
  },
};

exports.HTTP_STATUS = {
  SUCCESS: 'success',
  FAIL: 'fail',
  ERROR: 'error',
};

exports.HTTP_STATUS_MESSAGES = {
  [this.HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR]:
    'This route is not yet defined',
};

exports.ROLES = {
  USER: 'user',
  TOUR_GUIDE: 'tour-guide',
  LEAD_GUIDE: 'lead-guide',
  ADMIN: 'admin',
};
