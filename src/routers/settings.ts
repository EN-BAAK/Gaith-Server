import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings";
import { updateSettingsValidation } from "../validations/settings";
import { verifyAuthentication, verifyRole } from "../middlewares/auth";
import { ROLE } from "../types/variables";
import { validation } from "../middlewares/error";

const router = Router();

router.get("/", getSettings);

router.put("/", verifyAuthentication, verifyRole([ROLE.ADMIN]), updateSettingsValidation, validation, updateSettings);

export default router;