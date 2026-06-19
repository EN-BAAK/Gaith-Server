import { body, param } from "express-validator";

export const colorId = [
  param("id")
    .isInt()
    .withMessage("Color id must be an integer"),
];

export const createColor = [
  body("name")
    .notEmpty()
    .withMessage("Color name is required"),
];

export const updateColor = [
  param("id")
    .isInt()
    .withMessage("Color id must be an integer"),

  body("name")
    .optional()
    .notEmpty()
    .withMessage("Color name cannot be empty"),
];