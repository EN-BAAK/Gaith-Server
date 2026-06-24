import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";

import {
  getAllProducts,
  getAllProductsSettings,
  createProduct,
  updateProduct,
  deleteProductById,
  getProductById,
  getProductByIdSettings,
} from "../services/products";
import { AuthenticatedRequest, ID, ROLE } from "../types/variables";

export const getAll = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const page = parseInt(req.query.p as string) || 1;
  const limit = parseInt(req.query.l as string) || 10;

  const search = req.query.s as string;

  const categoryId = req.query.categoryId as ID | undefined
  const brandId = req.query.brandId as ID | undefined

  const role = req.role! as ROLE

  const data = await getAllProducts(
    page,
    limit,
    search,
    categoryId,
    brandId,
    role
  );

  const total = data.count;
  const totalPages =
    Math.ceil(total / limit);

  sendSuccessResponse(res, 200, "Products fetched", {
    items: data.rows,
    page,
    limit,
    total,
    totalPages,
    hasMore:
      page < totalPages,
    nextPage:
      page < totalPages
        ? page + 1
        : null,
    prevPage:
      page > 1
        ? page - 1
        : null,
  },);
});

export const getAllSettings = catchAsyncErrors(async (req: Request, res: Response) => {
  const page = parseInt(req.query.p as string) || 1;
  const limit = parseInt(req.query.l as string) || 10;
  const offsetUnit = parseInt(req.query.o as string) || 0;

  const search = req.query.s as string;

  const data = await getAllProductsSettings(page, limit, offsetUnit, search);

  const total = data.count;
  const totalPages =
    Math.ceil(total / limit);

  sendSuccessResponse(res, 200, "Products settings fetched", {
    items: data.rows,
    page,
    limit,
    total,
    totalPages,
    hasMore:
      page < totalPages,
    nextPage:
      page < totalPages
        ? page + 1
        : null,
    prevPage:
      page > 1
        ? page - 1
        : null,
  });
});

export const getById = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as ID;
  const role = req.role! as ROLE;
  const product = await getProductById(id, role);
  sendSuccessResponse(res, 200, "Product fetched", product);
});

export const getByIdSettings = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = req.params.id as ID;
  const product = await getProductByIdSettings(id);
  sendSuccessResponse(res, 200, "Product settings fetched", product
  );
});

export const create = catchAsyncErrors(async (req: Request, res: Response) => {
  const { colors, sizes, ...data } = req.body;
  const file = req.file;
  const product = await createProduct(data, file, { colors, sizes });
  sendSuccessResponse(res, 201, "Product created", product);
});

export const update = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = req.params.id as ID
  const { colors, sizes, ...data } = req.body;

  const product = await updateProduct(id, data, req.file, { colors, sizes });
  sendSuccessResponse(res, 200, "Product updated", product);
});

export const remove = catchAsyncErrors(async (req: Request, res: Response) => {
  const id = req.params.id as ID;

  const data = await deleteProductById(id);
  sendSuccessResponse(res, 200, "Product deleted", data);
});