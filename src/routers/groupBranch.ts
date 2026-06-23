import express from "express";
import { getGroupBranchById, createGroupBranch, updateGroupBranch, deleteGroupBranch, getAllGroupBranches } from "../controllers/groupBranches";
import { groupBranchIdParam as groupBranchIdParamValidation, createGroupBranch as createGroupBranchValidation, updateGroupBranch as updateGroupBranchValidation } from "../validations/groupBranch";
import { validation } from "../middlewares/error";
import { verifyAuthentication, verifyRole } from "../middlewares/auth";
import { ROLE } from "../types/variables";

const router = express.Router();

router.get("/", verifyAuthentication, verifyRole([ROLE.ADMIN]), getAllGroupBranches);
router.get("/:id", verifyAuthentication, verifyRole([ROLE.ADMIN]), groupBranchIdParamValidation, validation, getGroupBranchById);

router.post("/", verifyAuthentication, verifyRole([ROLE.ADMIN]), createGroupBranchValidation, validation, createGroupBranch);

router.put("/:id", verifyAuthentication, verifyRole([ROLE.ADMIN]), groupBranchIdParamValidation, updateGroupBranchValidation, validation, updateGroupBranch);

router.delete("/:id", verifyAuthentication, verifyRole([ROLE.ADMIN]), groupBranchIdParamValidation, validation, deleteGroupBranch);

export default router;
