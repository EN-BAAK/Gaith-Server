import { body, param } from "express-validator";

export const brandId = [
  param("id").isInt().withMessage("Brand id must be integer"),
];

export const createBrand = [
  body("name").notEmpty().withMessage("Brand name is required"),
];

export const updateBrand = [
  param("id").isInt(),

  body("name")
    .optional()
    .notEmpty()
    .withMessage("Brand name cannot be empty"),
];