const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { UserInputError } = require('apollo-server');
const {
  registrationValidation,
  loginValidation,
} = require('../../validation/user');

const generateToken = user => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

module.exports = {
  Query: {
    //
  },
  Mutation: {
    async login(_, { username, email, password }) {
      try {
        await loginValidation.validateAsync({ username, email, password });
      } catch (err) {
        throw new UserInputError(err.details[0]?.message);
      }

      const user = await User.findOne({ $or: [{ username }, { email }] });
      if (!user) throw new UserInputError('Enter valid credentials');

      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new UserInputError('Enter valid credentials');

      return {
        username: user.username,
        email: user.email,
        id: user._id,
        createdAt: user.createdAt,
        token: generateToken(user),
      };
    },

    async register(
      _,
      { registerInput: { username, password, confirmPassword, email } }
    ) {
      try {
        await registrationValidation.validateAsync({
          username,
          email,
          password,
        });
      } catch (err) {
        throw new UserInputError(err.details[0]?.message);
      }

      if (password !== confirmPassword)
        throw new UserInputError(`Confirm password doesn't match`);

      if (await User.findOne({ email }))
        throw new UserInputError('Email has already been registered');
      if (await User.findOne({ username }))
        throw new UserInputError('Username has already been taken');

      const newUser = new User({
        email,
        username,
        password: await bcrypt.hash(password, 12),
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();

      return { ...res._doc, id: res._id, token: generateToken(res) };
    },
  },
};
