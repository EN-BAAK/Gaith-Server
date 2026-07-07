import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { getSettingsData, updateSettingsData } from "../services/settings";

export const getSettings = catchAsyncErrors(async (_: Request, res: Response) => {
  const settings = await getSettingsData();
  sendSuccessResponse(res, 200, "Settings fetched successfully", settings);
});

export const updateSettings = catchAsyncErrors(async (req: Request, res: Response) => {
  const updatedSettings = await updateSettingsData(req.body);
  sendSuccessResponse(res, 200, "Settings updated successfully", updatedSettings);
});