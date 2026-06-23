import ErrorHandler from "../middlewares/error";
import { UnverifiedUser } from "../models/unverifiedUser";
import { generateVerificationCode } from "../utils/encrypt";
import { ID, ROLE } from "../types/variables";
import { UserCreationAttributes } from "../types/models";
import { resetEmailMessage, sendEmail, verifyAccountMessage } from "../utils/mails";
import { User } from "../models/users";
import { PasswordReset } from "../models/passwordReset";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

const sendVerificationEmail = async (user: User, unverified?: UnverifiedUser | null) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const code = generateVerificationCode();
  const htmlMessage = verifyAccountMessage(code);

  if (unverified) {
    unverified.code = code;
    unverified.expire = expiresAt;
    await unverified.save();
  } else {
    await UnverifiedUser.create({
      userId: user.id,
      code,
      expire: expiresAt,
    });
  }

  await sendEmail(user.email, "Al Gaith - Verify Your Account", htmlMessage);
};

export const registerService = async (userData: UserCreationAttributes) => {
  const existingUser = await User.findOne({ where: { email: userData.email } });

  if (existingUser) {
    const unverified = await UnverifiedUser.findOne({ where: { userId: existingUser.id } });
    if (unverified) {
      await sendVerificationEmail(existingUser, unverified);
      return { message: "Account is unverified. A new verification code has been sent to your email." };
    }
    throw new ErrorHandler("Email is already registered and verified", 400);
  }

  const newUser = await User.create(userData);
  await sendVerificationEmail(newUser, null);

  return { message: "Account created successfully. Please check your email for the verification code." };
};

export const resendVerificationAccountCodeService = async (email: string) => {
  const existingUser = await User.findOne({
    where: { email },
  });

  if (!existingUser) {
    throw new ErrorHandler("Account not found", 404);
  }

  const unverified = await UnverifiedUser.findOne({
    where: { userId: existingUser.id },
  });

  if (!unverified) {
    throw new ErrorHandler("Email is already registered and verified", 400);
  }

  await sendVerificationEmail(existingUser, unverified);

  return {
    message: "A new verification code has been sent to your email.",
  };
};

export const verifyAccountService = async (email: string, code: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new ErrorHandler("User not found", 404);

  const unverified = await UnverifiedUser.findOne({ where: { userId: user.id, code } });
  if (!unverified || unverified.expire < new Date()) {
    throw new ErrorHandler("Invalid or expired verification code", 400);
  }

  await unverified.destroy();

  return { message: "Account verified successfully. You can log in now." };
};

export const verifyUserService = async (userId: ID) => {
  const user = await User.findByPk(userId);
  if (!user) throw new ErrorHandler("User not found", 404);

  const unverified = await UnverifiedUser.findOne({ where: { userId } });
  if (unverified) {
    throw new ErrorHandler("User account is not verified", 403);
  }

  return user.toJSON();
};

export const getUnverifiedUsersService = async () => {
  return User.findAll({
    include: [{ model: UnverifiedUser, as: "unverified", required: true }],
    order: [["id", "DESC"]],
  });
};

export const getVerifiedUsersService = async () => {
  return User.findAll({
    include: [{ model: UnverifiedUser, as: "unverified", required: false }],
    where: {
      role: {
        [Op.ne]: "ADMIN",
      },
      "$unverified.id$": null
    },
    order: [["id", "DESC"]],
  });
};

export const updateRoleService = async (userId: ID, role: ROLE) => {
  const user = await User.findByPk(userId);
  if (!user) throw new ErrorHandler("User not found", 404);

  user.role = role;
  await user.save();

  return user.toJSON();
};

export const changePasswordService = async (userId: ID, password: '', newPassword: '') => {
  const user = await User.findByPk(userId);
  if (!user) throw new ErrorHandler("User not found", 404);

  const isMatch = await user.checkPassword(password);
  if (!isMatch) throw new ErrorHandler("Current password is incorrect", 401);

  user.password = newPassword;
  await user.save();

  return { message: "Password changed successfully" };
};

export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new ErrorHandler("User not found", 404);

  const unverified = await UnverifiedUser.findOne({ where: { userId: user.id } });
  if (unverified) {
    await sendVerificationEmail(user, unverified);
    throw new ErrorHandler("Please verify your account before resetting the password. OTP sent.", 403);
  }

  await PasswordReset.destroy({ where: { userId: user.id } });

  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 دقيقة

  await PasswordReset.create({
    userId: user.id,
    code,
    expiresAt,
  });

  const htmlMessage = resetEmailMessage(code);
  await sendEmail(user.email, "Al Gaith - Password Reset Request", htmlMessage);

  return { message: "Reset code sent to email" };
};

export const resetForgottenPasswordService = async (code: string, newPassword: '') => {
  const reset = await PasswordReset.findOne({ where: { code, isVerified: false } });
  if (!reset || reset.expiresAt < new Date()) {
    throw new ErrorHandler("Invalid or expired code", 400);
  }

  const user = await User.findByPk(reset.userId);
  if (!user) throw new ErrorHandler("User not found", 404);

  user.password = newPassword;
  await user.save();

  await reset.destroy();

  return { message: "Password successfully reset" };
};

export const getUserProfileService = async (userId: ID) => {
  const user = await User.findByPk(userId);
  if (!user) throw new ErrorHandler("User not found", 404);
  return user.toJSON();
};

export const loginService = async (email: string, password: '') => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new ErrorHandler("Invalid email or password", 401);

  const isMatch = await user.checkPassword(password);
  if (!isMatch) throw new ErrorHandler("Invalid email or password", 401);

  const unverified = await UnverifiedUser.findOne({ where: { userId: user.id } });
  if (unverified) {
    await sendVerificationEmail(user, unverified);
    throw new ErrorHandler("Please verify your account before logging in. A new verification code has been sent to your email.", 403);
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return { user: user.toJSON(), token };
};