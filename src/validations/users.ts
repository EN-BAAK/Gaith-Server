import { body, param } from "express-validator";
import { ROLE } from "../types/variables";

export const userIdValidation = [
  param("id").isInt().withMessage("User id must be integer"),
];

export const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("phone").notEmpty().withMessage("Phone is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

export const verifyAccountValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("otp").notEmpty().withMessage("Verification code is required"),
];

export const updateRoleValidation = [
  param("id").isInt().withMessage("User id must be integer"),
  body("role").isIn([ROLE.WHOLESALE, ROLE.RETAIL]).withMessage("Invalid role type"),
];

export const changePasswordValidation = [
  body("password").notEmpty().withMessage("Current password is required"),
  body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters long"),
];

export const forgotPasswordValidation = [
  param("email").isEmail().withMessage("Valid email is required"),
];

export const resendVerificationCodeValidation = [
  param("email").isEmail().withMessage("Valid email is required"),
];

export const resetForgottenPasswordValidation = [
  body("code").notEmpty().withMessage("Reset code is required"),
  body("password").isLength({ min: 6 }).withMessage("New password must be at least 6 characters long"),
];

export const loginValidation = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isString().withMessage("Password must be a string"),
];