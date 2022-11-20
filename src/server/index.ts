require('dotenv').config();

import { apolloServer } from '../graphql';
import express from 'express';
import { sequelize } from '../models';
import routes from './routes';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(routes);
(async () => {
  await sequelize.sync();
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  app.listen(PORT, () => {
    const message = `Server started on the port ${PORT} (GraphQL at ${apolloServer.graphqlPath})`;
    // eslint-disable-next-line no-console
    console.log(message);
  });
})();
