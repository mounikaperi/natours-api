const mongoose = require('mongoose');
const validator = require('validator');
const { USER_SCHEMA_VALIDATION_ERRORS } = require('../utils/constants');

exports.userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, USER_SCHEMA_VALIDATION_ERRORS.NAME],
  },
  email: {
    type: String,
    required: [true, USER_SCHEMA_VALIDATION_ERRORS.EMAIL],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, USER_SCHEMA_VALIDATION_ERRORS.VALID_EMAIL],
  },
  photo: String,
  password: {
    type: String,
    required: [true, USER_SCHEMA_VALIDATION_ERRORS.PASSWORD],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, USER_SCHEMA_VALIDATION_ERRORS.CONFIRM_PASSWORD],
  },
});
