import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../controllers/categories";

import { verifyAuthentication } from "../middlewares/auth";
import { categoryId, createCategory, updateCategory } from "../validations/categories";
import { validation } from "../middlewares/error";

const router = Router();

router.get("/", getAll);
router.get("/:id", categoryId, validation, getById);

router.post("/", verifyAuthentication, createCategory, validation, create);
router.put("/:id", verifyAuthentication, updateCategory, validation, update);
router.delete("/:id", verifyAuthentication, categoryId, validation, remove);

export default router;