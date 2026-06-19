import { DataTypes, Model, Sequelize } from "sequelize";
import { CategoryAttributes, CategoryCreationAttributes } from "../types/models";
import { ID } from "../types/variables";

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: ID;
  public name!: string;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    Category.hasMany(models.Product, {
      foreignKey: "categoryId",
      as: "products",
      onDelete: "CASCADE"
    });
  }
}

export default (sequelize: Sequelize) => {
  Category.init(
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
      tableName: "categories",
      timestamps: false,
    }
  );

  return Category;
};