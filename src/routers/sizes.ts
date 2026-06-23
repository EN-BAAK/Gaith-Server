import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../controllers/sizes";

import { verifyAuthentication, verifyRole } from "../middlewares/auth";
import { validation } from "../middlewares/error";

import {
  sizeId,
  createSize as createSizeValidation,
  updateSize as updateSizeValidation,
} from "../validations/sizes";
import { ROLE } from "../types/variables";

const router = Router();

router.get("/", verifyAuthentication, verifyRole([ROLE.ADMIN]), getAll);

router.get(
  "/:id",
  verifyAuthentication,
  verifyRole([ROLE.ADMIN]),
  sizeId,
  validation,
  getById
);

router.post(
  "/",
  verifyAuthentication,
  verifyRole([ROLE.ADMIN]),
  createSizeValidation,
  validation,
  create
);

router.put(
  "/:id",
  verifyAuthentication,
  verifyRole([ROLE.ADMIN]),
  updateSizeValidation,
  validation,
  update
);

router.delete(
  "/:id",
  verifyAuthentication,
  verifyRole([ROLE.ADMIN]),
  sizeId,
  validation,
  remove
);

export default router;