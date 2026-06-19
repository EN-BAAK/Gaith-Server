import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import {
  getAllSizes,
  getSizeById,
  createSize,
  updateSize,
  deleteSize,
} from "../services/sizes";
import { sendSuccessResponse } from "../middlewares/success";

export const getAll = catchAsyncErrors(async (_: Request, res: Response) => {
  const data = await getAllSizes();
  sendSuccessResponse(res, 200, "Sizes fetched successfully", data);
});

export const getById = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await getSizeById(id);

  sendSuccessResponse(res, 200, "Size fetched successfully", data);
});

export const create = catchAsyncErrors(async (req: Request, res: Response) => {
  const data = await createSize(req.body);
  sendSuccessResponse(res, 201, "Size created successfully", data);
});

export const update = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await updateSize(id, req.body);

  sendSuccessResponse(res, 200, "Size updated successfully", data);
});

export const remove = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await deleteSize(id);

  sendSuccessResponse(res, 200, "Size deleted successfully", data);
});