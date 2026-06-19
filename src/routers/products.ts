import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth";

import {
  getAll,
  getAllSettings,
  create,
  update,
  remove,
} from "../controllers/products";
import { uploadProductImage } from "../utils/multer";

const router = Router();

router.get("/", getAll);
router.get("/settings", verifyAuthentication, getAllSettings);

router.post(
  "/",
  verifyAuthentication,
  uploadProductImage.single("image"),
  create
);

router.put(
  "/:id",
  verifyAuthentication,
  uploadProductImage.single("image"),
  update
);

router.delete(
  "/:id",
  verifyAuthentication,
  remove
);

export default router;