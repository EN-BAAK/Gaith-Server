import {
  DataTypes,
  Model,
  Sequelize
} from "sequelize";

import {
  OrderAttributes,
  OrderCreationAttributes
} from "../types/models";

import { ID, OrderStatus } from "../types/variables";

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: ID;
  public userId!: ID;
  public status!: OrderStatus
  public invoiceDiscountPercent!: number;
  public isPaid!: boolean;

  public toJSON(): object {
    return {
      ...this.get()
    };
  }

  static associate(models: any) {
    Order.hasMany(models.OrderItem, {
      foreignKey: "orderId",
      as: "items",
      onDelete: "CASCADE"
    });

    Order.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE"
    });
  }
}

export default (sequelize: Sequelize) => {
  Order.init(
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
      status: {
        type: DataTypes.ENUM(...Object.values(OrderStatus)),
        defaultValue: OrderStatus.PENDING,
      },
      invoiceDiscountPercent: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {
      sequelize,
      tableName: "orders",
      timestamps: true,
    }
  );
  return Order;
}