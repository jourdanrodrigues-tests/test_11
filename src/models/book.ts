import * as Sequelize from 'sequelize';

export class Book extends Sequelize.Model<
  Sequelize.InferAttributes<Book>,
  Sequelize.InferCreationAttributes<Book>
> {
  declare id: Sequelize.CreationOptional<string>;
  declare name: string;
  declare pages: number;
  declare publishedAt: string | number | Date;
  declare description: string;
}

export default (sequelize: Sequelize.Sequelize) =>
  Book.init(
    {
      id: { type: Sequelize.UUID, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      pages: { type: Sequelize.INTEGER, allowNull: false },
      publishedAt: { type: Sequelize.DATE, allowNull: false },
      description: { type: Sequelize.STRING, allowNull: false }
    },
    { sequelize }
  );
