import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth";
import { validation } from "../middlewares/error";
import { getAll, getById, create, update, remove, } from "../controllers/brands";
import { uploadBrandImage } from "../utils/multer";
import { brandId, createBrand, updateBrand } from "../validations/brands";

const router = Router();

router.get("/", getAll);
router.get("/:id", brandId, validation, getById);

router.post("/", verifyAuthentication, uploadBrandImage.single("image"), createBrand, validation, create);

router.put("/:id", verifyAuthentication, uploadBrandImage.single("image"), updateBrand, validation, update);

router.delete("/:id", verifyAuthentication, brandId, validation, remove);

export default router;