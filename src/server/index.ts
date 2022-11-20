require('dotenv').config();

import express from 'express';
const { ApolloServer } = require('apollo-server-express');
import { sequelize } from '../models';
import routes from './routes';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

const PORT = process.env.PORT || 3000;

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
app.use(express.json());
app.use(routes);
(async () => {
  await sequelize.sync();
  await server.start();
  server.applyMiddleware({ app });
  app.listen(PORT, () => {
    const message = `Server started on the port ${PORT} (GraphQL at ${server.graphqlPath})`;
    // eslint-disable-next-line no-console
    console.log(message);
  });
})();
