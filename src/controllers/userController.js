const User = require('../models/userModel');
const catchAsync = require('../utils/commonUtils');
const AppError = require('../utils/AppError');
const {
  HTTP_STATUS_CODES,
  HTTP_STATUS,
  HTTP_STATUS_MESSAGES,
  AUTHENTICATION_ERRORS,
} = require('../utils/constants');

exports.updateMe = async (request, response, next) => {
  // Create Error if user tries to update password related data
  if (request.body.password || request.body.passwordConfirm) {
    return next(
      new AppError(
        AUTHENTICATION_ERRORS.NOT_A_PASSWORD_ROUTE,
        HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST,
      ),
    );
  }
  // Update the user document- role-admin and other important fields cannot be updated
  const filteredBody = catchAsync.filterInputRequest(
    request.body,
    'name',
    'email',
  );
  const updatedUser = await User.findByIdAndUpdate(
    request.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    },
  );
  response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK).json({
    status: HTTP_STATUS.SUCCESS,
    data: {
      user: updatedUser,
    },
  });
};

exports.deleteMe = catchAsync(async (request, response, next) => {
  await User.findByIdAndUpdate(request.user.id, { active: false });
  response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.NO_CONTENT).json({
    status: HTTP_STATUS.SUCCESS,
    data: null,
  });
});

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
