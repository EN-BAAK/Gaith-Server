import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../controllers/categories";

import { verifyAuthentication, verifyRole } from "../middlewares/auth";
import { categoryId, createCategory, updateCategory } from "../validations/categories";
import { validation } from "../middlewares/error";
import { ROLE } from "../types/variables";

const router = Router();

router.get("/", getAll);
router.get("/:id", verifyAuthentication, verifyRole([ROLE.ADMIN]), categoryId, validation, getById);

router.post("/", verifyAuthentication, verifyRole([ROLE.ADMIN]), createCategory, validation, create);
router.put("/:id", verifyAuthentication, verifyRole([ROLE.ADMIN]), updateCategory, validation, update);
router.delete("/:id", verifyAuthentication, verifyRole([ROLE.ADMIN]), categoryId, validation, remove);

export default router;