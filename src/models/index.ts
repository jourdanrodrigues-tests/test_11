import path from 'path';
import process from 'process';
import { Sequelize } from 'sequelize';

import initBook from './book';
import initBookReader from './bookReader';
import initStudent from './student';

const env = process.env.NODE_ENV || 'development';
const configPath = path.join(path.dirname(__dirname), 'config', 'config.json');
const config = require(configPath)[env];

const dbUrl = process.env[config.use_env_variable];
if (typeof dbUrl !== 'string') {
  throw new Error(`Missing ${config.use_env_variable} in the environment.`);
}

export const sequelize = new Sequelize(dbUrl, config);

// Executing "init" sort of manually to assure the init order
const db = [initBook, initStudent, initBookReader].reduce(
  (output, initModel) => {
    const model = initModel(sequelize);
    return { ...output, [model.name]: model };
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  {} as { [key: string]: any }
);

Object.keys(db).forEach((modelName) => {
  if (!db[modelName].associate) return;
  db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
