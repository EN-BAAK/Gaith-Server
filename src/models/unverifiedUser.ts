import { DataTypes, Model, Sequelize } from "sequelize";
import { UnverifiedUserAttributes, UnverifiedUserCreationAttributes } from "../types/models";
import { ID } from "../types/variables";

export class UnverifiedUser
  extends Model<UnverifiedUserAttributes, UnverifiedUserCreationAttributes>
  implements UnverifiedUserAttributes {
  public id!: ID;
  public userId!: ID;
  public code!: string;
  public expire!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    UnverifiedUser.belongsTo(models.User, { foreignKey: "userId", as: "user", onDelete: "CASCADE" });
  }
}

export default (sequelize: Sequelize) => {
  UnverifiedUser.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expire: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "unverified_users",
      timestamps: true,
    }
  );

  return UnverifiedUser;
};
