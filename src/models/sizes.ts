import { DataTypes, Model, Sequelize } from "sequelize";
import { SizeAttributes, SizeCreationAttributes } from "../types/models";
import { ID } from "../types/variables";

export class Size extends Model<SizeAttributes, SizeCreationAttributes> implements SizeAttributes {
  public id!: ID;
  public name!: string;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    Size.belongsToMany(models.Product, {
      through: "product_sizes",
      foreignKey: "sizeId",
      otherKey: "productId",
      as: "products",
      onDelete: "CASCADE"
    });
  }
}

export default (sequelize: Sequelize) => {
  Size.init(
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
      tableName: "sizes",
      timestamps: false,
    }
  );

  return Size;
};