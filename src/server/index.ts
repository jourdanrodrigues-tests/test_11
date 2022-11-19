require('dotenv').config();

import express from 'express';
import { sequelize } from '../models';
import routes from './routes';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(routes);

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server started on the port ${PORT}`));
});
