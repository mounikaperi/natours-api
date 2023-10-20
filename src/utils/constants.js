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
};

exports.HTTP_STATUS = {
  SUCCESS: 'success',
  FAIL: 'fail',
};
