const postResolvers = require('./postResolvers');
const userResolvers = require('./userResolvers');
const postCommentsResolvers = require('./postCommentsResolvers');

module.exports = {
  Post: {
    likesCount: parent => parent.likes.length,
    commentsCount: parent => parent.comments.length,
  },
  Query: {
    ...postResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...postCommentsResolvers.Mutation,
  },
};
