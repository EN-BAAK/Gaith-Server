import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../controllers/colors";

import { verifyAuthentication } from "../middlewares/auth";
import { validation } from "../middlewares/error";

import {
  colorId,
  createColor as createColorValidation,
  updateColor as updateColorValidation,
} from "../validations/colors";

const router = Router();

router.get("/", getAll);

router.get(
  "/:id",
  colorId,
  validation,
  getById
);

router.post(
  "/",
  verifyAuthentication,
  createColorValidation,
  validation,
  create
);

router.put(
  "/:id",
  verifyAuthentication,
  updateColorValidation,
  validation,
  update
);

router.delete(
  "/:id",
  verifyAuthentication,
  colorId,
  validation,
  remove
);

export default router;