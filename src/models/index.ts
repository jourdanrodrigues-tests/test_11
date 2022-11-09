import fs from 'fs';
import path from 'path';
import process from 'process';
import { DataTypes } from 'sequelize';

const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configPath = path.join(path.dirname(__dirname), 'config', 'config.json');
const config = require(configPath)[env];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: { [key: string]: any } = {};

const sequelize = new Sequelize(process.env[config.use_env_variable], config);

fs.readdirSync(__dirname).forEach((file) => {
  const isModel =
    file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts';
  if (!isModel) return;
  const model = require(path.join(__dirname, file))(sequelize, DataTypes);
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (!db[modelName].associate) return;
  db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
