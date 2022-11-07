import { Sequelize, DataTypes, Deferrable } from 'sequelize';
import {
  ModelAttributeColumnReferencesOptions,
  ModelType
} from 'sequelize/types/model';
import { TableName } from 'sequelize/types/dialects/abstract/query-interface';

if (!process.env.DATABASE_URL) {
  throw new Error('"DATABASE_URL" is required to be set in the environment.');
}

const sequelize = new Sequelize(process.env.DATABASE_URL);

export const Student = sequelize.define('Student', {
  id: { type: DataTypes.UUID, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  birthDate: { type: DataTypes.DATE, allowNull: true }
});

export const Book = sequelize.define('Book', {
  id: { type: DataTypes.UUID, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  pages: { type: DataTypes.INTEGER, allowNull: false },
  publishedAt: { type: DataTypes.DATE, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false }
});

export const BookReader = sequelize.define('BookReader', {
  id: { type: DataTypes.UUID, primaryKey: true },
  studentId: { type: DataTypes.UUID, references: buildReference(Student) },
  bookId: { type: DataTypes.UUID, references: buildReference(Book) }
});

function buildReference(
  model: TableName | ModelType
): ModelAttributeColumnReferencesOptions {
  return {
    model,
    key: 'id',
    // @ts-ignore
    deferrable: Deferrable.INITIALLY_IMMEDIATE
  };
}
