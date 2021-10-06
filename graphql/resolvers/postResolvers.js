const { UserInputError } = require('apollo-server-errors');
const { checkAuth, authorizeAction } = require('../../middleware/auth');
const Post = require('../../models/Post');
const { postCreateValidation } = require('../../validation/post');

module.exports = {
  Query: {
    posts: async () => {
      try {
        return await Post.find().sort({ createdAt: -1 });
      } catch (error) {
        throw new Error(error);
      }
    },
    post: async (_, { postId }) => {
      try {
        return await Post.findById(postId);
      } catch (error) {
        throw new UserInputError('Post not found');
      }
    },
  },
  Mutation: {
    async createPost(_, { title, body }, { req }) {
      try {
        await postCreateValidation.validateAsync({ title, body });
      } catch (err) {
        throw new UserInputError(err.details[0]?.message);
      }
      const user = checkAuth(req);

      const newPost = new Post({
        title,
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      return await newPost.save();
    },
    async deletePost(_, { postId }, { req }) {
      const user = checkAuth(req);
      const post = await Post.findById(postId);
      authorizeAction(user.username === post.username);
      await post.delete();
      return 'Post deleted successfully';
    },
    async likePost(_, { postId }, { req }) {
      const { username } = checkAuth(req);
      try {
        const post = await Post.findById(postId);
        if (post.likes.find(l => l.username === username)) {
          post.likes = post.likes.filter(l => l.username !== username);
        } else {
          post.likes.unshift({ username, createdAt: new Date().toISOString() });
        }
        await post.save();
        return post;
      } catch (error) {
        throw new UserInputError('Post not found');
      }
    },
  },
};
