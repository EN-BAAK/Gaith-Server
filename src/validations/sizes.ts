import { body, param } from "express-validator";

export const sizeId = [
  param("id")
    .isInt()
    .withMessage("Size id must be an integer"),
];

export const createSize = [
  body("name")
    .notEmpty()
    .withMessage("Size name is required"),
];

export const updateSize = [
  param("id")
    .isInt()
    .withMessage("Size id must be an integer"),

  body("name")
    .optional()
    .notEmpty()
    .withMessage("Size name cannot be empty"),
];