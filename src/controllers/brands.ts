import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";

import {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrandById,
} from "../services/brands";
import { ID } from "../types/variables";

export const getAll = catchAsyncErrors(async (_: Request, res: Response) => {
  const data = await getAllBrands();

  sendSuccessResponse(
    res,
    200,
    "Brands fetched successfully",
    data
  );
});

export const getById = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = req.params.id as ID;

  const data = await getBrandById(id);

  sendSuccessResponse(
    res,
    200,
    "Brand fetched successfully",
    data
  );
});

export const create = catchAsyncErrors(async (req: Request, res: Response) => {
  const data = await createBrand(req.body, req.file);

  sendSuccessResponse(
    res,
    201,
    "Brand created successfully",
    data
  );
});

export const update = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = req.params.id as ID;

  const data = await updateBrand(id, req.body, req.file);

  sendSuccessResponse(
    res,
    200,
    "Brand updated successfully",
    data
  );
});

export const remove = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = req.params.id as ID;

  const data = await deleteBrandById(id);

  sendSuccessResponse(
    res,
    200,
    "Brand deleted successfully",
    data
  );
});