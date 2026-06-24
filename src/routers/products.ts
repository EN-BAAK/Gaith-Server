import { Router } from "express";
import { verifyAuthentication, verifyRole } from "../middlewares/auth";

import {
  getAll,
  getAllSettings,
  create,
  update,
  remove,
  getByIdSettings,
  getById,
} from "../controllers/products";
import { uploadProductImage } from "../utils/multer";
import { ROLE } from "../types/variables";

const router = Router();

router.get("/", getAll);
router.get("/settings", verifyAuthentication, verifyRole([ROLE.ADMIN]), getAllSettings);
router.get("/:id/settings", verifyAuthentication, verifyRole([ROLE.ADMIN]), getByIdSettings);
router.get("/:id", getById);

router.post("/", verifyAuthentication, verifyRole([ROLE.ADMIN]), uploadProductImage.single("image"), create);

router.put("/:id", verifyAuthentication, verifyRole([ROLE.ADMIN]), uploadProductImage.single("image"), update);

router.delete("/:id", verifyAuthentication, verifyRole([ROLE.ADMIN]), remove);

export default router;