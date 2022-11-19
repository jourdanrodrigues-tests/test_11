import * as Sequelize from 'sequelize';
import { Client } from 'pg';

import { parse } from 'pg-connection-string';
import process from 'process';

if (typeof process.env.DATABASE_URL === 'undefined') {
  throw new Error('Missing "DATABASE_URL" in the environment.');
}
const dbConfig = parse(process.env.DATABASE_URL);

const dbName = dbConfig.database;
if (!dbName) {
  throw new Error('"DATABASE_URL" missing the database spec.');
}

module.exports = {
  async up(queryInterface: Sequelize.QueryInterface) {
    const client = new Client(process.env.DATABASE_URL);
    await client.connect();
    const createDbQuery = `CREATE DATABASE IF NOT EXISTS "${dbConfig.database}"`;
    client.query(createDbQuery, () => client.end());
    await queryInterface.createSchema(dbName);
    await queryInterface.createTable('Student', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: { type: Sequelize.STRING, allowNull: false },
      lastName: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      birthDate: { type: Sequelize.DATE, allowNull: true }
    });
    await queryInterface.createTable('Book', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: { type: Sequelize.STRING, allowNull: false },
      pages: { type: Sequelize.INTEGER, allowNull: false },
      publishedAt: { type: Sequelize.DATE, allowNull: false },
      description: { type: Sequelize.STRING, allowNull: false }
    });
    await queryInterface.createTable('BookReader', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      studentId: {
        type: Sequelize.UUID,
        references: {
          model: 'Student',
          key: 'id',
          // @ts-ignore
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
      },
      bookId: {
        type: Sequelize.UUID,
        references: {
          model: 'Book',
          key: 'id',
          // @ts-ignore
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
      }
    });
  },
  async down(queryInterface: Sequelize.QueryInterface) {
    await queryInterface.dropTable('Student');
    await Promise.all([
      queryInterface.dropTable('Student'),
      queryInterface.dropTable('Book')
    ]);
  }
};
