const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config();

const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/typeDefs');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(process.env.MONGODB_CONNECTION_URL, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB connected');
    return server.listen({ port: process.env.PORT || 5000 });
  })
  .then(({ url }) => {
    console.log(`Server is running on ${url}`);
  });
