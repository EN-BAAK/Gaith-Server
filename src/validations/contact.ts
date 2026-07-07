import { body } from "express-validator";

export const contactValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),
    
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required"),
    
  body("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email address"),
    
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message content cannot be empty")
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters long"),
];