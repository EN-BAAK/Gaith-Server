import { Router } from "express";
import { verifyAuthentication, verifyRole } from "../middlewares/auth";
import { validation } from "../middlewares/error";
import { getAll, getById, create, update, remove, } from "../controllers/brands";
import { uploadBrandImage } from "../utils/multer";
import { brandId, createBrand, updateBrand } from "../validations/brands";
import { ROLE } from "../types/variables";

const router = Router();

router.get("/", getAll);
router.get("/:id", verifyAuthentication, verifyRole([ROLE.ADMIN]), brandId, validation, getById);

router.post("/", verifyAuthentication, verifyRole([ROLE.ADMIN]), uploadBrandImage.single("image"), createBrand, validation, create);

router.put("/:id", verifyAuthentication, verifyRole([ROLE.ADMIN]), uploadBrandImage.single("image"), updateBrand, validation, update);

router.delete("/:id", verifyAuthentication, verifyRole([ROLE.ADMIN]), brandId, validation, remove);

export default router;