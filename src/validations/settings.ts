import { body } from "express-validator";

export const updateSettingsValidation = [
  body("supportEmail")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid support email address"),

  body("phone")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Phone must be a string"),

  body("whatsapp")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("WhatsApp must be a string"),

  body(["youtube", "instagram", "facebook", "linkedIn", "twitter", "tiktok"])
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Social media links must be a valid URL"),

  body("aboutSubtitle")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("About subtitle must be a string"),
];