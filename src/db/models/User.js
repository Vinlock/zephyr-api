const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validation = require('../../utils/validation');

const { Schema } = mongoose;
const SALT_ROUNDS = 10;

const setPassword = (val) => {
  return bcrypt.hashSync(val, SALT_ROUNDS);
};

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true,
    min: 3,
    max: 20,
    validate: validation.hasNoSymbols,
  },
  usernameChangedAt: {
    type: Date,
    default: null,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    min: 8,
    max: 30,
    validate: validation.validateEmail,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailChangedAt: {
    type: Date,
    default: null,
  },
  password: {
    type: String,
    require: true,
    min: 8,
    max: 30,
    set: setPassword,
  },
  passwordChangedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

const passwordValidators = [
  {
    validator: validation.containsNumbers(1),
    msg: 'INVALID_PASSWORD',
  },
  {
    validator: validation.containsLetters(1),
    msg: 'INVALID_PASSWORD',
  },
  {
    validator: validation.containsCharacters(1),
    msg: 'INVALID_PASSWORD',
  },
];

passwordValidators.forEach((validator) => {
  userSchema.path('password')
    .validate(validator.validator, validator.msg);
});

const userObject = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  createdAt: user.createdAt,
  passwordChangedAt: user.passwordChangedAt,
  emailChangedAt: user.emailChangedAt,
  usernameChangedAt: user.usernameChangedAt,
  emailVerified: user.emailVerified,
  admin: user.admin ? true : undefined,
});

userSchema.statics = {
  login(email, password) {
    return this.findOne({ email })
      .then((user) => {
        const valid = bcrypt.compareSync(password, user.password);
        if (!valid) throw new Error('INVALID_PASSWORD');
        return userObject(user);
      })
      .catch((err) => {
        if (err.message === 'INVALID_PASSWORD') throw err;
        throw new Error('INVALID_EMAIL');
      });
  },
  findById(_id) {
    return this.findOne({_id})
      .then(user => userObject(user));
  },
  changeEmailAddress(_id, newEmail) {
    return this.findOne({_id})
      .then((user) => {
        user.email = newEmail;
        user.emailChangedAt = Date.now();
        return user.save()
          .then(() => {
            return userObject(user);
          });
      });
  },
  changeUsername(_id, newUsername) {
    return this.findOne({_id})
      .then((user) => {
        user.username = newUsername;
        user.usernameChangedAt = Date.now();
        return user.save()
          .then(() => {
            return userObject(user);
          });
      });
  },
  changePassword(_id, newPassword) {
    return this.findOne({_id})
      .then((user) => {
        const same = bcrypt.compareSync(newPassword, user.password);
        if (same) throw new Error('PASSWORD_SAME');
        user.password = newPassword;
        user.passwordChangedAt = Date.now();
        return user.save()
          .then(() => {
            return userObject(user);
          })
          .catch((err) => {
            console.error(err);
          });
      });
  },
};

const User = mongoose.model('User', userSchema);

module.exports = User;
