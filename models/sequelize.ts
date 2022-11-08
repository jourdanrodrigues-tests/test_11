import { Sequelize } from 'sequelize';
import process from 'process';

if (!process.env.DATABASE_URL) {
  throw new Error('"DATABASE_URL" is required to be set in the environment.');
}

const sequelize = new Sequelize(process.env.DATABASE_URL);

export default sequelize;
