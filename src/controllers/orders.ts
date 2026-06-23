import { Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares/error";
import { sendSuccessResponse } from "../middlewares/success";
import { getOrders, getOrderById, getUserOrders, getUserOrderById, createOrder, updateOrder, deleteOrder } from "../services/orders";
import { AuthenticatedRequest } from "../types/variables";

export const getAll = catchAsyncErrors(async (req: Request, res: Response) => {
  const page = parseInt(req.query.p as string) || 1;
  const limit = parseInt(req.query.l as string) || 10;

  const data = await getOrders(page, limit);
  sendSuccessResponse(res, 200, "Orders fetched", data);
});

export const getUserAll = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const id = req.id!
  const data = await getUserOrders(id);
  sendSuccessResponse(res, 200, "Orders fetched", data);
});

export const getById = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const data = await getOrderById(req.params.id as any);
  sendSuccessResponse(res, 200, "Order fetched", data);
});

export const getUserById = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const data = await getUserOrderById(req.params.id as any);
  sendSuccessResponse(res, 200, "Order fetched", data);
});

export const create = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const { id, role } = req
  const data = await createOrder(id!, role!, req.body);
  sendSuccessResponse(res, 201, "Order created", data);
});

export const update = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const data = await updateOrder(req.params.id as any, req.role!, req.body);
  sendSuccessResponse(res, 200, "Order updated", data);
});

export const remove = catchAsyncErrors(async (req: AuthenticatedRequest, res: Response) => {
  const data = await deleteOrder(req.params.id as any);
  sendSuccessResponse(res, 200, "Order deleted", data);
});