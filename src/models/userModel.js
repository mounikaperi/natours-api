const bcrypt = require('bcryptjs');
const { userSchema } = require('../schemas/userSchema');

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  // Hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // passwordConfirm shouldn't be stored in db
  this.passwordConfirm = undefined;
});
