const factoryHandler = require('../handlers/factoryHandler');
const User = require('../models/userModel');
const catchAsync = require('../utils/commonUtils');
const AppError = require('../utils/AppError');
const {
  HTTP_STATUS_CODES,
  HTTP_STATUS,
  AUTHENTICATION_ERRORS,
} = require('../utils/constants');

exports.getMe = (request, response, next) => {
  request.params.id = request.user.id;
  next();
};

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

exports.getUser = factoryHandler.getOne(User);
exports.getAllUsers = factoryHandler.getAll(User);
exports.updateUser = factoryHandler.updateOne(User);
exports.deleteUser = factoryHandler.deleteOne(User);
