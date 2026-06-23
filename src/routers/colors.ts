import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../controllers/colors";

import { verifyAuthentication, verifyRole } from "../middlewares/auth";
import { validation } from "../middlewares/error";

import {
  colorId,
  createColor as createColorValidation,
  updateColor as updateColorValidation,
} from "../validations/colors";
import { ROLE } from "../types/variables";

const router = Router();

router.get("/", verifyAuthentication, verifyRole([ROLE.ADMIN]), getAll);

router.get(
  "/:id",
  verifyAuthentication,
  verifyRole([ROLE.ADMIN]),
  colorId,
  validation,
  getById
);

router.post(
  "/",
  verifyAuthentication,
  verifyRole([ROLE.ADMIN]),
  createColorValidation,
  validation,
  create
);

router.put(
  "/:id",
  verifyAuthentication,
  verifyRole([ROLE.ADMIN]),
  updateColorValidation,
  validation,
  update
);

router.delete(
  "/:id",
  verifyAuthentication,
  verifyRole([ROLE.ADMIN]),
  colorId,
  validation,
  remove
);

export default router;