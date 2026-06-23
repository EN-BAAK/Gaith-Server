import { DataTypes, Model, Sequelize } from "sequelize";

import {
  OrderItemAttributes,
  OrderItemCreationAttributes,
} from "../types/models";

import { ID } from "../types/variables";

export class OrderItem
  extends Model<OrderItemAttributes, OrderItemCreationAttributes>
  implements OrderItemAttributes {
  public id!: ID;
  public orderId!: ID;
  public productId!: ID;
  public quantity!: number;
  public unitPrice!: number;
  public itemDiscountPercent!: number;

  public toJSON() {
    return {
      ...this.get(),
    };
  }

  static associate(models: any) {
    OrderItem.belongsTo(models.Order, {
      foreignKey: "orderId",
      as: "order",
      onDelete: "CASCADE"
    });
  }
}

export default (sequelize: Sequelize) => {
  OrderItem.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      orderId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      productId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      unitPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      itemDiscountPercent: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "order_items",
      timestamps: true,
    }
  );

  return OrderItem;
};