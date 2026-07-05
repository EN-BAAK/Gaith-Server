import { BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin, DataTypes, Model, Sequelize } from "sequelize";
import path from "path";
import fs from "fs";

import {
  ProductAttributes,
  ProductCreationAttributes,
} from "../types/models";

import { ID } from "../types/variables";
import { Color } from "./colors";
import { Size } from "./sizes";

export class Product extends Model<
  ProductAttributes,
  ProductCreationAttributes
> implements ProductAttributes {

  public id!: ID;

  public title!: string;

  public categoryId!: ID;
  public brandId!: ID;

  public imgUrl!: string | null;

  public summarize!: string | null;

  public retailPrice!: number;
  public wholesalePrice!: number;

  public description!: string | null;

  public addColor!: BelongsToManyAddAssociationMixin<Color, number>;
  public removeColor!: BelongsToManyRemoveAssociationMixin<Color, number>;
  public addSize!: BelongsToManyAddAssociationMixin<Size, number>;
  public removeSize!: BelongsToManyRemoveAssociationMixin<Size, number>;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    Product.belongsToMany(models.Color, {
      through: "product_colors",
      foreignKey: "productId",
      otherKey: "colorId",
      as: "colors",
      onDelete: "CASCADE"
    });

    Product.belongsToMany(models.Size, {
      through: "product_sizes",
      foreignKey: "productId",
      otherKey: "sizeId",
      as: "sizes",
      onDelete: "CASCADE"
    });

    Product.belongsTo(models.Brand, {
      foreignKey: "brandId",
      as: "brand",
      onDelete: "CASCADE"
    });

    Product.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
      onDelete: "CASCADE",
    });

    Product.hasMany(models.Category, {
      foreignKey: "productId",
      as: "items",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      categoryId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      brandId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      imgUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      summarize: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },

      retailPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      wholesalePrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "products",
      timestamps: false,

      hooks: {
        beforeDestroy: async (product: Product) => {
          if (product.imgUrl) {
            try {
              const imgPath = path.resolve(product.imgUrl);

              if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
              }
            } catch (err) {
              console.log("Failed to delete product image:", err);
            }
          }
        },
      },
    }
  );

  return Product;
};