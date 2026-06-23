import sequelize from "../models";
import { Order } from "../models/order";
import { OrderItem } from "../models/orderItem";
import { Product } from "../models/products";
import ErrorHandler from "../middlewares/error";
import { ID, ROLE, OrderStatus } from "../types/variables";
import { OrderItemInput } from "../types/transactions";

const findOrderById = async (id: ID, withItems = false) => {
  const order = await Order.findByPk(id, {
    include: withItems ? [{ model: OrderItem, as: "items" }] : []
  });

  if (!order) throw new ErrorHandler("Order not found", 404);
  return order;
};

export const getOrders = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  return Order.findAndCountAll({ limit, offset, order: [["id", "DESC"]] });
};

export const getOrderById = async (id: ID) => {
  return findOrderById(id, true);
};

export const getUserOrders = async (userId: ID) => {
  return Order.findAll({ where: { userId }, order: [["id", "DESC"]] });
};

export const getUserOrderById = async (id: ID) => {
  return findOrderById(id, true);
};

export const createOrder = async (userId: ID, role: ROLE, data: any) => {
  const t = await sequelize.transaction();

  try {
    const order = await Order.create({
      userId,
      isPaid: false,
      status: OrderStatus.PENDING,
      invoiceDiscountPercent: data.invoiceDiscountPercent ?? 0
    }, { transaction: t });

    for (const item of data.items) {
      const product = await Product.findByPk(item.productId);
      if (!product) throw new ErrorHandler("Product not found", 404);

      const unitPrice = role === ROLE.WHOLESALE ? product.wholesalePrice : product.retailPrice;

      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        itemDiscountPercent: item.itemDiscountPercent ?? 0
      }, { transaction: t });
    }

    await t.commit();
    return findOrderById(order.id, true);
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const handleOrderItems = async (order: Order, items: OrderItemInput[], role: ROLE, transaction: any) => {
  for (const item of items) {
    switch (item.state) {
      case "new":
        const product = await Product.findByPk(item.productId);
        if (!product) throw new ErrorHandler("Product not found", 404);

        await OrderItem.create({
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity!,
          unitPrice: role === ROLE.WHOLESALE ? product.wholesalePrice : product.retailPrice,
          itemDiscountPercent: item.itemDiscountPercent ?? 0
        }, { transaction });
        break;

      case "remove":
        await OrderItem.destroy({
          where: { id: item.id, orderId: order.id },
          transaction
        });
        break;

      case "edit":
        await OrderItem.update({
          quantity: item.quantity,
          itemDiscountPercent: item.itemDiscountPercent
        }, {
          where: { id: item.id, orderId: order.id },
          transaction
        });
        break;

      case "old":
        break;
    }
  }
};

export const updateOrder = async (id: ID, role: ROLE, data: any) => {
  const t = await sequelize.transaction();

  try {
    const order = await findOrderById(id, true);

    if (order.isPaid) throw new ErrorHandler("Paid order cannot be edited", 400);

    if (order.status === OrderStatus.RECEIVED) {
      if (data.status || data.invoiceDiscountPercent) {
        throw new ErrorHandler("Received order cannot be edited", 400);
      }
    }

    Object.assign(order, data);
    await order.save({ transaction: t });

    if (data.items) {
      await handleOrderItems(order, data.items, role, t);
    }

    await t.commit();
    return findOrderById(id, true);
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

export const deleteOrder = async (id: ID) => {
  const order = await findOrderById(id);
  await order.destroy();
  return order;
};