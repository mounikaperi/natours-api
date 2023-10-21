const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/commonUtils');
const AppError = require('../utils/AppError');
const {
  HTTP_STATUS_CODES,
  HTTP_STATUS,
  AUTHENTICATION_ERRORS,
} = require('../utils/constants');

const returnSignedJwtToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = async (request, response, next) => {
  const newUser = User.create({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    passwordConfirm: request.body.passwordConfirm,
  });
  const token = returnSignedJwtToken(newUser._id);
  response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.CREATED).json({
    status: HTTP_STATUS.SUCCESS,
    token,
    data: {
      user: newUser,
    },
  });
};

exports.login = catchAsync(async (request, response, next) => {
  const body = request || {};
  const { email, password: enteredPassword } = body || {};
  // Check if email and password exists in db
  if (!email || !enteredPassword) {
    return next(
      new AppError(
        AUTHENTICATION_ERRORS.MISSING_EMAIL_PASSWORD,
        HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST,
      ),
    );
  }
  // Check if user exists and if password is correct
  const user = await User.findOne({ email }).select('+password');
  const { password: existingPassword } = user || {};
  const isComparedPasswordValid = await user.comparePasswords(
    enteredPassword,
    existingPassword,
  );
  if (!user || !isComparedPasswordValid) {
    return next(
      new AppError(
        AUTHENTICATION_ERRORS.INVALID_EMAIL_PASSWORD,
        HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.UNAUTHORIZED,
      ),
    );
  }
  // If all are validated, send the jwt to the client
  const token = returnSignedJwtToken(user._id);
  response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK).json({
    status: HTTP_STATUS.SUCCESS,
    token,
  });
});

exports.protectRoutesFromUnauthorizedAccess = catchAsync(
  async (request, response, next) => {
    // Getting token and check if it is present
    let token;
    if (
      request.headers.authorization &&
      request.headers.authorization.startsWith('Bearer')
    ) {
      token = request.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(
        new AppError(
          AUTHENTICATION_ERRORS.NOT_LOGGED_IN,
          HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.UNAUTHORIZED,
        ),
      );
    }
    // Verification token
    const decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET,
    );
    // Check if user still exists - To ensure user is not deleted from db after token is generated
    // Check if user changed password after the token was issued
    next();
  },
);
