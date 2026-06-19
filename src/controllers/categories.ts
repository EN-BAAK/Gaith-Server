import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categories";
import { sendSuccessResponse } from "../middlewares/success";

export const getAll = catchAsyncErrors(async (_: Request, res: Response) => {
  const data = await getAllCategories();
  sendSuccessResponse(res, 200, "Categories fetched successfully", data);
});

export const getById = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await getCategoryById(id);

  sendSuccessResponse(res, 200, "Category fetched successfully", data);
});

export const create = catchAsyncErrors(async (req: Request, res: Response) => {
  const data = await createCategory(req.body);
  sendSuccessResponse(res, 201, "Category created successfully", data);
});

export const update = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await updateCategory(id, req.body);

  sendSuccessResponse(res, 200, "Category updated successfully", data);
});

export const remove = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const data = await deleteCategory(id);

  sendSuccessResponse(res, 200, "Category deleted successfully", data);
});