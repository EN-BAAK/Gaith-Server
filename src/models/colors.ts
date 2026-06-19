import { DataTypes, Model, Sequelize } from "sequelize";
import { ColorAttributes, ColorCreationAttributes } from "../types/models";
import { ID } from "../types/variables";

export class Color extends Model<ColorAttributes, ColorCreationAttributes> implements ColorAttributes {
  public id!: ID;
  public name!: string;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    Color.belongsToMany(models.Product, {
      through: "product_colors",
      foreignKey: "colorId",
      otherKey: "productId",
      as: "products",
      onDelete: "CASCADE"
    });
  }
}

export default (sequelize: Sequelize) => {
  Color.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      tableName: "colors",
      timestamps: false,
    }
  );

  return Color;
};