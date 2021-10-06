const { UserInputError } = require('apollo-server-errors');
const { checkAuth, authorizeAction } = require('../../middleware/auth');
const Post = require('../../models/Post');
const { commentCreateValidation } = require('../../validation/comment');

module.exports = {
  Query: {},
  Mutation: {
    async createComment(_, { postId, body }, { req }) {
      try {
        await commentCreateValidation.validateAsync({ body });
      } catch (err) {
        throw new UserInputError(err.details[0]?.message);
      }
      const { username } = checkAuth(req);

      try {
        const post = await Post.findById(postId);
        post.comments?.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        return await post.save();
      } catch (error) {
        throw new UserInputError('Post not found');
      }
    },
    async deleteComment(_, { postId, commentId }, { req }) {
      const { username } = checkAuth(req);
      try {
        const post = await Post.findById(postId);
        const commentIndex = post.comments.findIndex(c => c.id === commentId);
        authorizeAction(username === post.comments[commentIndex].username);
        post.comments.splice(commentIndex, 1);
        await post.save();
        return post;
      } catch (error) {
        throw new UserInputError('Post or comment not found');
      }
    },
  },
};
