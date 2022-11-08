import { TableName } from 'sequelize/types/dialects/abstract/query-interface';
import {
  ForeignKey,
  ModelAttributeColumnReferencesOptions,
  ModelType
} from 'sequelize/types/model';
import Student from './student';
import Book from './book';

import {
  Model,
  DataTypes,
  Deferrable,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize';

import sequelize from './sequelize';

class BookReader extends Model<
  InferAttributes<BookReader>,
  InferCreationAttributes<BookReader>
> {
  declare id: CreationOptional<string>;
  declare studentId: ForeignKey<Student>;
  declare bookId: ForeignKey<Book>;
}

BookReader.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true },
    studentId: { type: DataTypes.UUID, references: buildReference(Student) },
    bookId: { type: DataTypes.UUID, references: buildReference(Book) }
  },
  { sequelize }
);

export default BookReader;

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
