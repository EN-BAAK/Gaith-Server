import { Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { getDashboardStats } from "../services/dashboard";
import { AuthenticatedRequest } from "../types/variables";

export const getDashboardData = catchAsyncErrors(async (_: AuthenticatedRequest, res: Response) => {
  const stats = await getDashboardStats();
  sendSuccessResponse(res, 200, "Dashboard statistics fetched successfully", stats);
});