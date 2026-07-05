import { Op, fn, col, literal } from "sequelize";
import { Product } from "../models/products";
import { User } from "../models/users";
import { ROLE } from "../types/variables";
import { Order } from "../models/order";
import { OrderItem } from "../models/orderItem";

export const getDashboardStats = async () => {
  const now = new Date();

  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const [
    totalUsers,
    wholesaleUsers,
    totalProducts,
    activeOrdersCount
  ] = await Promise.all([
    User.count(),
    User.count({ where: { role: ROLE.WHOLESALE } }),
    Product.count(),
    Order.count({ where: { status: "Completed" } })
  ]);

  const calculateRevenue = async (dateFilter: any) => {
    const result = await OrderItem.findAll({
      attributes: [
        [
          literal(`
            SUM(
              OrderItem.quantity * OrderItem.unitPrice *
              (1 - COALESCE(OrderItem.itemDiscountPercent, 0) / 100) *
              (1 - COALESCE(order.invoiceDiscountPercent, 0) / 100)
            )
          `),
          "revenue"
        ]
      ],
      include: [
        {
          model: Order,
          as: "order",
          attributes: [],
          where: {
            status: "Completed",
            ...dateFilter
          }
        }
      ],
      raw: true
    }) as any;

    return parseFloat(result?.[0]?.revenue || 0);
  };

  const currentMonthRevenue = await calculateRevenue({
    createdAt: { [Op.gte]: startOfCurrentMonth }
  });

  const previousMonthRevenue = await calculateRevenue({
    createdAt: {
      [Op.between]: [startOfPreviousMonth, endOfPreviousMonth]
    }
  });

  const getChart = async (dateFilter: any) => {
    return await OrderItem.findAll({
      attributes: [
        [fn("DATE", col("order.createdAt")), "date"],
        [fn("COUNT", col("order.id")), "orders"],
        [
          literal(`
            SUM(
              OrderItem.quantity * OrderItem.unitPrice *
              (1 - COALESCE(OrderItem.itemDiscountPercent, 0) / 100) *
              (1 - COALESCE(order.invoiceDiscountPercent, 0) / 100)
            )
          `),
          "revenue"
        ]
      ],
      include: [
        {
          model: Order,
          as: "order",
          attributes: [],
          where: dateFilter
        }
      ],
      group: ["date"],
      order: [[literal("date"), "ASC"]],
      raw: true
    });
  };

  const currentMonthOrdersPlot = await getChart({
    createdAt: { [Op.gte]: startOfCurrentMonth }
  });

  const previousMonthOrdersPlot = await getChart({
    createdAt: {
      [Op.between]: [startOfPreviousMonth, endOfPreviousMonth]
    }
  });

  const topSellingProducts = await OrderItem.findAll({
    attributes: [
      "productId",
      [fn("SUM", col("OrderItem.quantity")), "totalSold"]
    ],
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["id", "title", "imgUrl", "retailPrice", "wholesalePrice"]
      },
      {
        model: Order,
        as: "order",
        attributes: [],
        required: true,
        where: {
          status: "Completed"
        }
      }
    ],
    group: ["OrderItem.productId", "product.id"],
    order: [[literal("totalSold"), "DESC"]],
    limit: 5,
    raw: true,
    subQuery: false
  });

  const latestUsers = await User.findAll({
    attributes: ["id", "name", "email", "role", "createdAt"],
    order: [["id", "DESC"]],
    limit: 5
  });

  const latestOrders = await Order.findAll({
    attributes: ["id", "status", "createdAt"],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["name", "email"]
      }
    ],
    order: [["id", "DESC"]],
    limit: 5
  });

  return {
    cards: {
      totalUsers,
      wholesaleUsers,
      totalProducts,
      activeOrdersCount,
      revenue: {
        currentMonth: currentMonthRevenue,
        previousMonth: previousMonthRevenue
      }
    },

    charts: {
      currentMonth: currentMonthOrdersPlot,
      previousMonth: previousMonthOrdersPlot
    },

    topProducts: topSellingProducts,

    recentActivity: {
      latestUsers,
      latestOrders
    }
  };
};