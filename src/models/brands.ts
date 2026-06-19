import { DataTypes, Model, Sequelize } from "sequelize";
import path from "path";
import fs from "fs";

import {
  BrandAttributes,
  BrandCreationAttributes,
} from "../types/models";

import { ID } from "../types/variables";

export class Brand extends Model<
  BrandAttributes,
  BrandCreationAttributes
> implements BrandAttributes {

  public id!: ID;
  public name!: string;
  public imgUrl!: string | null;

  public toJSON(): object {
    return { ...this.get() };
  }

  static associate(models: any) {
    Brand.hasMany(models.Product, {
      foreignKey: "brandId",
      as: "products",
      onDelete: "CASCADE"
    });
  }
}

export default (sequelize: Sequelize) => {
  Brand.init(
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

      imgUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "brands",
      timestamps: false,

      hooks: {
        beforeDestroy: async (brand: Brand) => {
          if (brand.imgUrl) {
            try {
              const imgPath = path.resolve(brand.imgUrl);

              if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
              }
            } catch (err) {
              console.log("Failed to delete brand image:", err);
            }
          }
        },
      },
    }
  );

  return Brand;
};