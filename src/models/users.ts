import { DataTypes, Model, Sequelize } from "sequelize";
import { UserAttributes, UserCreationAttributes } from "../types/models";
import { hashPassword, comparePassword } from "../utils/encrypt";
import { ID, ROLE } from "../types/variables";

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: ID;
  public name!: string;
  public phone!: string;
  public email!: string;
  public password!: string;
  public role!: ROLE;

  public async checkPassword(password: string): Promise<boolean> {
    return comparePassword(password, this.password);
  }

  public toJSON(): object {
    const { password: _, ...values } = this.get();
    return values;
  }

  static associate(models: any) {
    User.hasOne(models.UnverifiedUser, { foreignKey: "userId", as: "unverified", onDelete: "CASCADE" });
    User.hasOne(models.PasswordReset, { foreignKey: "userId", as: "passwordReset", onDelete: "CASCADE" });
    User.hasMany(models.Order, { foreignKey: "userId", as: "orders", onDelete: "CASCADE" });
  }
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(...Object.values(ROLE)),
        allowNull: false,
        defaultValue: ROLE.RETAIL,
      },
    },
    {
      sequelize,
      tableName: "users",
      timestamps: true,
      hooks: {
        beforeCreate: async (user: User) => {
          if (user.password) {
            user.password = await hashPassword(user.password);
          }
        },
        beforeUpdate: async (user: User) => {
          if (user.changed("password")) {
            user.password = await hashPassword(user.password);
          }
        },
      },
    }
  );

  return User;
};