import { body, param } from "express-validator";

export const orderId = [
  param("id").isInt().withMessage("Order id must be integer")
];

export const createOrder = [
  body("items").isArray().withMessage("Items must be array"),
  body("items.*.productId").isInt(),
  body("items.*.quantity").isInt()
];