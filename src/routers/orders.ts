import { Router } from "express";
import { verifyAuthentication, verifyRole } from "../middlewares/auth";
import { getAll, getUserAll, getById, getUserById, create, update, remove } from "../controllers/orders";
import { orderId } from "../validations/orders";
import { validation } from "../middlewares/error";
import { ROLE } from "../types/variables";

const router = Router();

router.get("/", verifyAuthentication, verifyRole([ROLE.ADMIN]), getAll);
router.get("/user", verifyAuthentication, getUserAll);
router.get("/:id", verifyAuthentication, verifyRole([ROLE.ADMIN]), getById);
router.get("/user/:id", verifyAuthentication, getUserById);

router.post("/", verifyAuthentication, create);

router.put("/:id", verifyAuthentication, orderId, validation, update);

router.delete("/:id", verifyAuthentication, verifyRole([ROLE.ADMIN]), orderId, validation, remove);

export default router;