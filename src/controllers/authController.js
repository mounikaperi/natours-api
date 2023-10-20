const User = require('../models/userModel');
const { HTTP_STATUS_CODES, HTTP_STATUS } = require('../utils/constants');

exports.signup = async (request, response, next) => {
  const newUser = User.create({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    passwordConfirm: request.body.passwordConfirm,
  });
  response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.CREATED).json({
    status: HTTP_STATUS.SUCCESS,
    data: {
      newUser,
    },
  });
};
