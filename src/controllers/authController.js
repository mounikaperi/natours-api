const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { HTTP_STATUS_CODES, HTTP_STATUS } = require('../utils/constants');

exports.signup = async (request, response, next) => {
  const newUser = User.create({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    passwordConfirm: request.body.passwordConfirm,
  });
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.CREATED).json({
    status: HTTP_STATUS.SUCCESS,
    token,
    data: {
      user: newUser,
    },
  });
};
