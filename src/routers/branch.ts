import express from "express";
import { getBranches, getBranchById, createBranch, updateBranch, deleteBranch, getBranchesSettings, getBranchByIdSettings } from "../controllers/branches";
import { branchIdParam, createBranch as createBranchValidation, updateBranch as updateBranchValidation } from "../validations/branch";
import { validation } from "../middlewares/error";
import { verifyAuthentication, verifyRole } from "../middlewares/auth";
import { ROLE } from "../types/variables";

const router = express.Router();

router.get("/", getBranches);
router.get("/settings", verifyAuthentication, verifyRole([ROLE.ADMIN]), getBranchesSettings);
router.get("/:id", verifyAuthentication, branchIdParam, validation, getBranchById);
router.get("/:id/settings", verifyAuthentication, verifyRole([ROLE.ADMIN]), branchIdParam, validation, getBranchByIdSettings);

router.post("/", verifyAuthentication, verifyRole([ROLE.ADMIN]), createBranchValidation, validation, createBranch);

router.put("/:id", verifyAuthentication, verifyRole([ROLE.ADMIN]), branchIdParam, updateBranchValidation, validation, updateBranch);

router.delete("/:id", verifyAuthentication, verifyRole([ROLE.ADMIN]), branchIdParam, validation, deleteBranch);

export default router;
