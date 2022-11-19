import * as Sequelize from 'sequelize';

export class Student extends Sequelize.Model<
  Sequelize.InferAttributes<Student>,
  Sequelize.InferCreationAttributes<Student>
> {
  declare id: Sequelize.CreationOptional<string>;
  declare name: string;
  declare lastName: string;
  declare email: string;
  declare birthDate: string | null;
}

export default (sequelize: Sequelize.Sequelize) =>
  Student.init(
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: { type: Sequelize.STRING, allowNull: false },
      lastName: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      birthDate: { type: Sequelize.DATE, allowNull: true }
    },
    { sequelize }
  );
