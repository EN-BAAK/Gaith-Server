import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import {
  getAllColors,
  getColorById,
  createColor,
  updateColor,
  deleteColor,
} from "../services/colors";
import { sendSuccessResponse } from "../middlewares/success";

export const getAll = catchAsyncErrors(async (_: Request, res: Response) => {
  const data = await getAllColors();
  sendSuccessResponse(res, 200, "Colors fetched successfully", data);
});

export const getById = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await getColorById(id);

  sendSuccessResponse(res, 200, "Color fetched successfully", data);
});

export const create = catchAsyncErrors(async (req: Request, res: Response) => {
  const data = await createColor(req.body);
  sendSuccessResponse(res, 201, "Color created successfully", data);
});

export const update = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await updateColor(id, req.body);

  sendSuccessResponse(res, 200, "Color updated successfully", data);
});

export const remove = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await deleteColor(id);

  sendSuccessResponse(res, 200, "Color deleted successfully", data);
});