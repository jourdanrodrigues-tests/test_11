import { TableName } from 'sequelize/types/dialects/abstract/query-interface';
import {
  ForeignKey,
  ModelAttributeColumnReferencesOptions,
  ModelType
} from 'sequelize/types/model';
import { Student } from './student';
import { Book } from './book';

import * as Sequelize from 'sequelize';

class BookReader extends Sequelize.Model<
  Sequelize.InferAttributes<BookReader>,
  Sequelize.InferCreationAttributes<BookReader>
> {
  declare id: Sequelize.CreationOptional<string>;
  declare studentId: ForeignKey<Student>;
  declare bookId: ForeignKey<Book>;
}

export default (sequelize: Sequelize.Sequelize) =>
  BookReader.init(
    {
      id: { type: Sequelize.UUID, primaryKey: true },
      studentId: { type: Sequelize.UUID, references: buildReference(Student) },
      bookId: { type: Sequelize.UUID, references: buildReference(Book) }
    },
    { sequelize }
  );

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
