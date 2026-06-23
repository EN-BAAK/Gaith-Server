import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth";
import { getAll, getUserAll, getById, getUserById, create, update, remove } from "../controllers/orders";
import { orderId } from "../validations/orders";
import { validation } from "../middlewares/error";

const router = Router();

router.get("/", verifyAuthentication, getAll);
router.get("/user", verifyAuthentication, getUserAll);
router.get("/:id", verifyAuthentication, getById);
router.get("/user/:id", verifyAuthentication, getUserById);

router.post("/", verifyAuthentication, create);

router.put("/:id", verifyAuthentication, orderId, validation, update);

router.delete("/:id", verifyAuthentication, orderId, validation, remove);

export default router;