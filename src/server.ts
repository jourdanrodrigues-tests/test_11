require('dotenv').config();

import { apolloServer } from './graphql';
import express from 'express';
import { sequelize } from './models';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

(async () => {
  await sequelize.sync();
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  app.listen(PORT, () => {
    const message = `GraphQL started at http://localhost:${PORT}${apolloServer.graphqlPath})`;
    // eslint-disable-next-line no-console
    console.log(message);
  });
})();
