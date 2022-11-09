import * as Sequelize from 'sequelize';

export class Student extends Sequelize.Model<
  Sequelize.InferAttributes<Student>,
  Sequelize.InferCreationAttributes<Student>
> {
  declare id: Sequelize.CreationOptional<string>;
  declare name: string;
  declare lastName: string;
  declare email: string;
  declare birthDate: string;
}

export default (sequelize: Sequelize.Sequelize) =>
  Student.init(
    {
      id: { type: Sequelize.UUID, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      lastName: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      birthDate: { type: Sequelize.DATE, allowNull: true }
    },
    { sequelize }
  );
