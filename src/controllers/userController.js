const {
  HTTP_STATUS_CODES,
  HTTP_STATUS,
  HTTP_STATUS_MESSAGES,
} = require('../utils/constants');

exports.getAllUsers = (request, response) => {
  response
    .status(HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR)
    .json({
      status: HTTP_STATUS.ERROR,
      message:
        HTTP_STATUS_MESSAGES[
          HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR
        ],
    });
};

exports.getUser = (request, response) => {
  response
    .status(HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR)
    .json({
      status: HTTP_STATUS.ERROR,
      message:
        HTTP_STATUS_MESSAGES[
          HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR
        ],
    });
};

exports.createUser = (request, response) => {
  response
    .status(HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR)
    .json({
      status: HTTP_STATUS.ERROR,
      message:
        HTTP_STATUS_MESSAGES[
          HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR
        ],
    });
};

exports.updateUser = (request, response) => {
  response
    .status(HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR)
    .json({
      status: HTTP_STATUS.ERROR,
      message:
        HTTP_STATUS_MESSAGES[
          HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR
        ],
    });
};

exports.deleteUser = (request, response) => {
  response
    .status(HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR)
    .json({
      status: HTTP_STATUS.ERROR,
      message:
        HTTP_STATUS_MESSAGES[
          HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR
        ],
    });
};
