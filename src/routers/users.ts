import { Router } from "express";
import { verifyAuthentication, verifyAuthenticationHeader, verifyRole } from "../middlewares/auth";
import { validation } from "../middlewares/error";
import { register, verifyAccount, verifyUser, getUnverifiedUsers, getVerifiedUsers, updateRole, changePassword, forgotPassword, resetForgottenPassword, getProfile, login, logout, resendVerificationAccountCode, verify, } from "../controllers/users";
import { registerValidation, verifyAccountValidation, updateRoleValidation, changePasswordValidation, forgotPasswordValidation, resetForgottenPasswordValidation, loginValidation, resendVerificationCodeValidation, } from "../validations/users";
import { ROLE } from "../types/variables";

const router = Router();

router.get("/profile", verifyAuthentication, getProfile);
router.get("/verify-me", verifyAuthentication, verifyUser);
router.get("/unverified", verifyAuthentication, verifyRole([ROLE.ADMIN]), getUnverifiedUsers);
router.get("/verified", verifyAuthentication, verifyRole([ROLE.ADMIN]), getVerifiedUsers);
router.get("/verify-protected-middleware", verifyAuthenticationHeader, verify);

router.post("/logout", verifyAuthentication, logout);
router.post("/login", loginValidation, validation, login);
router.post("/register", registerValidation, validation, register);
router.post("/verify-account", verifyAccountValidation, validation, verifyAccount);

router.patch("/forgot-password/:email", forgotPasswordValidation, validation, forgotPassword);
router.patch("/reset-password", resetForgottenPasswordValidation, validation, resetForgottenPassword);
router.patch("/resend-verification-code/:email", resendVerificationCodeValidation, validation, resendVerificationAccountCode);
router.put("/change-password", verifyAuthentication, changePasswordValidation, validation, changePassword);
router.put("/change-role/:id", verifyAuthentication, updateRoleValidation, validation, updateRole);

export default router;