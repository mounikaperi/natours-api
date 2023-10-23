const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/commonUtils');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');
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
    // Verification token- to make sure token is not altered by anyone
    const decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET,
    );
    // Check if user still exists - To ensure user is not deleted from db after token is generated
    const existingUserWithDecodedTokenId = await User.findById(decodedToken.id);
    if (!existingUserWithDecodedTokenId) {
      return next(
        new AppError(
          AUTHENTICATION_ERRORS.NO_USER_FOR_TOKEN,
          HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.UNAUTHORIZED,
        ),
      );
    }
    // Check if user changed password after the token was issued
    if (
      existingUserWithDecodedTokenId.checkIfPasswordModified(decodedToken.iat)
    ) {
      return next(
        new AppError(
          AUTHENTICATION_ERRORS.PASSWORD_CHANGED,
          HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.UNAUTHORIZED,
        ),
      );
    }
    // Grant access to the protected route
    request.user = existingUserWithDecodedTokenId;
    next();
  },
);

exports.restrictAccessTo =
  (...roles) =>
  (request, response, next) => {
    // roles => array of roles passed as argument, protectRoutesFromUnauthorizedAccess stores the user in request
    if (!roles.includes(request.user.role)) {
      return next(
        new AppError(
          AUTHENTICATION_ERRORS.NO_PERMISSION,
          HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.FORBIDDEN,
        ),
      );
    }
    next();
  };

exports.forgotPassword = async (request, response, next) => {
  // Get user based on posted email
  const existingUserBasedOnEmail = await User.findOne({
    email: request.body.email,
  });
  if (!existingUserBasedOnEmail) {
    return next(
      new AppError(
        AUTHENTICATION_ERRORS.NO_USER_FOR_EMAIL,
        HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.NOT_FOUND,
      ),
    );
  }
  // Generate random reset token
  const resetToken = existingUserBasedOnEmail.createPasswordResetToken();
  await existingUserBasedOnEmail.save({ validateBeforeSave: false });
  // send it to user's email
  // eslint-disable-next-line prettier/prettier
  const resetURL = `${request.protocol}://${request.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `${AUTHENTICATION_ERRORS.RESET_PASSWORD}: ${resetURL}. ${AUTHENTICATION_ERRORS.IGNORE_PASSWORD_RESET_EMAIL}`;
  try {
    await sendEmail({
      email: existingUserBasedOnEmail.email,
      subject: 'Your password reset token (valid for 10 mins)',
      message,
    });
    response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK).json({
      status: HTTP_STATUS.SUCCESS,
      message: AUTHENTICATION_ERRORS.TOKEN_SENT_TO_EMAIL,
    });
  } catch (error) {
    existingUserBasedOnEmail.passwordResetToken = undefined;
    existingUserBasedOnEmail.passwordResetExpires = undefined;
    await existingUserBasedOnEmail.save({ validateBeforeSave: false });
    return next(
      new AppError(
        AUTHENTICATION_ERRORS.SEND_EMAIL_FAIL,
        HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
      ),
    );
  }
};
