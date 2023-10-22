const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { userSchema } = require('../schemas/userSchema');

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  // Hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // passwordConfirm shouldn't be stored in db
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePasswords = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.checkIfPasswordModified = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
