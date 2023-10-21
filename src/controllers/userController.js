const User = require('../models/tourModel');
const catchAsync = require('../utils/commonUtils');
const {
  HTTP_STATUS_CODES,
  HTTP_STATUS,
  HTTP_STATUS_MESSAGES,
} = require('../utils/constants');

exports.getAllUsers = catchAsync(async (request, response) => {
  const users = await User.find();
  response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK).json({
    status: HTTP_STATUS.SUCCESS,
    data: {
      users,
    },
  });
});

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
