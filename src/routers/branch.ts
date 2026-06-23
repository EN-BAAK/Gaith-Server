import express from "express";
import { getBranches, getBranchById, createBranch, updateBranch, deleteBranch } from "../controllers/branches";
import { branchIdParam, createBranch as createBranchValidation, updateBranch as updateBranchValidation } from "../validations/branch";
import { validation } from "../middlewares/error";
import { verifyAuthentication } from "../middlewares/auth";

const router = express.Router();

router.get("/", getBranches);
router.get("/:id", verifyAuthentication, branchIdParam, validation, getBranchById);

router.post("/", verifyAuthentication, createBranchValidation, validation, createBranch);

router.put("/:id", verifyAuthentication, branchIdParam, updateBranchValidation, validation, updateBranch);

router.delete("/:id", verifyAuthentication, branchIdParam, validation, deleteBranch);

export default router;
