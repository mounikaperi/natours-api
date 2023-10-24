const mongoose = require('mongoose');
const validator = require('validator');
const { USER_SCHEMA_VALIDATION_ERRORS, ROLES } = require('../utils/constants');

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
  role: {
    type: String,
    enum: [ROLES.USER, ROLES.TOUR_GUIDE, ROLES.LEAD_GUIDE, ROLES.ADMIN],
    default: ROLES.USER,
  },
  password: {
    type: String,
    required: [true, USER_SCHEMA_VALIDATION_ERRORS.PASSWORD],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, USER_SCHEMA_VALIDATION_ERRORS.CONFIRM_PASSWORD],
    validate: {
      // This only works on create and save
      validator: function (el) {
        return el === el.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
