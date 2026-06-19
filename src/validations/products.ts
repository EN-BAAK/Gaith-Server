import { body, param } from "express-validator";

export const productId = [
  param("id").isInt().withMessage("Product id must be integer"),
];

export const createProduct = [
  body("title").notEmpty(),
  body("categoryId").isInt(),
  body("brandId").isInt(),
  body("retailPrice").isFloat(),
  body("wholesalePrice").isFloat(),
];