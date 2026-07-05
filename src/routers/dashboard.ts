import { Router } from "express";
import { verifyAuthentication, verifyRole } from "../middlewares/auth";
import { getDashboardData } from "../controllers/dashboard";
import { ROLE } from "../types/variables";

const router = Router();

router.get("/", verifyAuthentication, verifyRole([ROLE.ADMIN]), getDashboardData);

export default router;