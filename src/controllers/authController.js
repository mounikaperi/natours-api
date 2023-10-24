const crypto = require('crypto');
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

const createSendToken = (user, statusCode, response) => {
  const token = returnSignedJwtToken(user._id);
  response.status(statusCode).json({
    status: HTTP_STATUS.SUCCESS,
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (request, response, next) => {
  const newUser = User.create({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    passwordConfirm: request.body.passwordConfirm,
  });
  createSendToken(
    newUser,
    HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.CREATED,
    response,
  );
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
  createSendToken(user, HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK, response);
});

exports.protectRoutesFromUnauthorizedAccess = catchAsync(
  async (request, response, next) => {
    // Getting token and check if it is present
    let token;
    const { headers } = request || {};
    const { authorization } = headers || {};
    if (authorization && authorization.startsWith('Bearer')) {
      token = authorization.split(' ')[1];
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
    existingUserBasedOnEmail.passwordResetToken = null;
    existingUserBasedOnEmail.passwordResetExpires = null;
    await existingUserBasedOnEmail.save({ validateBeforeSave: false });
    return next(
      new AppError(
        AUTHENTICATION_ERRORS.SEND_EMAIL_FAIL,
        HTTP_STATUS_CODES.SERVER_ERROR_RESPONSE.INTERNAL_SERVER_ERROR,
      ),
    );
  }
};

exports.resetPassword = async (request, response, next) => {
  // Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(request.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // If the token has not expired, and there is a user, set the new password
  if (!user) {
    return next(
      new AppError(
        AUTHENTICATION_ERRORS.INVALID_OR_EXPIRED_TOKEN,
        HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.BAD_REQUEST,
      ),
    );
  }
  user.password = request.body.password;
  user.passwordConfirm = request.body.passwordConfirm;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();
  // Update changePasswordAt property for the user
  // Log the user in, send JWT
  createSendToken(
    user,
    HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.CREATED,
    response,
  );
};

exports.updatePassword = async (request, response, next) => {
  // Get user from the collection
  const user = await User.findById(request.user.id).select('+password');
  // Check if posted password is valid
  if (
    !(await user.comparePasswords(request.body.passwordCurrent, user.password))
  ) {
    return next(
      new AppError(
        AUTHENTICATION_ERRORS.WRONG_PASSWORD,
        HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.UNAUTHORIZED,
      ),
    );
  }
  // Update password
  user.password = request.body.password;
  user.passwordConfirm = request.body.passwordConfirm;
  await user.save();
  // Log user in and send JWT
  createSendToken(user, HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK, response);
};
