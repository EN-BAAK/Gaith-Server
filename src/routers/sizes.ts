import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../controllers/sizes";

import { verifyAuthentication } from "../middlewares/auth";
import { validation } from "../middlewares/error";

import {
  sizeId,
  createSize as createSizeValidation,
  updateSize as updateSizeValidation,
} from "../validations/sizes";

const router = Router();

router.get("/", getAll);

router.get(
  "/:id",
  sizeId,
  validation,
  getById
);

router.post(
  "/",
  verifyAuthentication,
  createSizeValidation,
  validation,
  create
);

router.put(
  "/:id",
  verifyAuthentication,
  updateSizeValidation,
  validation,
  update
);

router.delete(
  "/:id",
  verifyAuthentication,
  sizeId,
  validation,
  remove
);

export default router;