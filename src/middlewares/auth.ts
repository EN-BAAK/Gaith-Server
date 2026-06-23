import jwt from "jsonwebtoken"
import { NextFunction, Response } from "express";
import ErrorHandler, { catchAsyncErrors } from "./error";
import { User } from "../models/users";
import { isBlacklisted } from "../utils/tokenBlacklist";
import { AuthenticatedRequest, ROLE } from "../types/variables";

export const verifyAuthentication = catchAsyncErrors(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.[process.env.COOKIE_NAME!];

    if (!token)
      return next(new ErrorHandler('Unauthorized: Token not found', 401));

    if (isBlacklisted(token)) {
      res.clearCookie(process.env.COOKIE_NAME!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return next(new ErrorHandler("Unauthorized: Token expired", 401));
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { userId: number };

    const user = await User.findByPk(payload.userId, { attributes: ['id', 'role'] });
    if (!user) {
      res.clearCookie(process.env.COOKIE_NAME!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return next(new ErrorHandler('User not found', 401));
    }
    req.id = user.id
    req.role = user.role

    next();
  }
);

export const verifyAuthenticationHeader = async (
  req: AuthenticatedRequest,
  _: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ErrorHandler("Unauthorized: Token not found", 401));
    }

    const token = authHeader.split(" ")[1];

    if (isBlacklisted(token)) {
      return next(new ErrorHandler("Unauthorized: Token expired", 401));
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

    const user = await User.findByPk(payload.userId, { attributes: ["id"] });
    if (!user) {
      return next(new ErrorHandler("User not found", 401));
    }

    req.id = user.id;

    next();
  } catch (err: any) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(new ErrorHandler("Unauthorized: Invalid or expired token", 401));
    }
    next(err);
  }
};

export const verifyRole = (allowedRoles: ROLE[]) => {
  return (req: AuthenticatedRequest, _: Response, next: NextFunction) => {
    if (!req.role) {
      return next(new ErrorHandler("Forbidden: No role assigned to this request", 403));
    }

    if (!allowedRoles.includes(req.role as ROLE)) {
      return next(new ErrorHandler("Forbidden: You do not have permission to access this resource", 403));
    }

    next();
  };
};