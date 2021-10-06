const { AuthenticationError } = require('apollo-server-errors');
const jwt = require('jsonwebtoken');

module.exports.checkAuth = req => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];
    if (token) {
      try {
        return jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        throw new AuthenticationError('This token has been blacklisted');
      }
    } else
      throw new AuthenticationError(
        "Authentication token must be 'Bearer [token]"
      );
  } else throw new AuthenticationError('Authorization header must be provided');
};

module.exports.authorizeAction = authorized => {
  if (!authorized)
    throw new AuthenticationError(
      'You are not authorized to perform this action'
    );
};
