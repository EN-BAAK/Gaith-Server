import { body, param } from "express-validator";

export const categoryId = [
  param("id")
    .isInt()
    .withMessage("Size id must be an integer"),
];

export const createCategory = [
  body("name")
    .notEmpty()
    .withMessage("Size name is required"),
];

export const updateCategory = [
  param("id")
    .isInt()
    .withMessage("Size id must be an integer"),

  body("name")
    .optional()
    .notEmpty()
    .withMessage("Size name cannot be empty"),
];