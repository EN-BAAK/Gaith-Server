import express from "express";
import { getGroupBranchById, createGroupBranch, updateGroupBranch, deleteGroupBranch, getAllGroupBranches } from "../controllers/groupBranches";
import { groupBranchIdParam as groupBranchIdParamValidation, createGroupBranch as createGroupBranchValidation, updateGroupBranch as updateGroupBranchValidation } from "../validations/groupBranch";
import { validation } from "../middlewares/error";
import { verifyAuthentication } from "../middlewares/auth";

const router = express.Router();

router.get("/", verifyAuthentication, getAllGroupBranches);
router.get("/:id", verifyAuthentication, groupBranchIdParamValidation, validation, getGroupBranchById);

router.post("/", verifyAuthentication, createGroupBranchValidation, validation, createGroupBranch);

router.put("/:id", verifyAuthentication, groupBranchIdParamValidation, updateGroupBranchValidation, validation, updateGroupBranch);

router.delete("/:id", verifyAuthentication, groupBranchIdParamValidation, validation, deleteGroupBranch);

export default router;
