import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { handleContactSubmission } from "../services/contact";

export const submitContactForm = catchAsyncErrors(async (req: Request, res: Response) => {
  const { fullName, phone, email, message } = req.body;

  await handleContactSubmission(fullName, phone, email, message);

  sendSuccessResponse(res, 200, "Message sent successfully to administration");
});