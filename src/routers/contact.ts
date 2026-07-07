import { Router } from "express";
import { submitContactForm } from "../controllers/contact";
import { contactValidation } from "../validations/contact";
import { validation } from "../middlewares/error";

const router = Router();

router.post("/", contactValidation, validation, submitContactForm);

export default router;