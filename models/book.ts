import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize';

import sequelize from './sequelizeInstance';

class Book extends Model<InferAttributes<Book>, InferCreationAttributes<Book>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare pages: number;
  declare publishedAt: string | number | Date;
  declare description: string;
}

Book.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    pages: { type: DataTypes.INTEGER, allowNull: false },
    publishedAt: { type: DataTypes.DATE, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false }
  },
  { sequelize }
);

export default Book;
