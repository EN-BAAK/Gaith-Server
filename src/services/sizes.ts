import ErrorHandler from "../middlewares/error";
import { Size } from "../models/sizes";

const findById = async (id: number) => {
  const item = await Size.findByPk(id);
  if (!item) throw new ErrorHandler("Size not found", 404);
  return item;
};

export const getAllSizes = async () => {
  return Size.findAll({ order: [["id", "DESC"]] });
};

export const getSizeById = async (id: number) => {
  const item = await findById(id);
  return item.toJSON();
};

export const createSize = async (data: { name: string }) => {
  const item = await Size.create(data);
  return item.toJSON();
};

export const updateSize = async (id: number, data: { name?: string }) => {
  const item = await findById(id);

  if (data.name !== undefined) {
    item.name = data.name;
  }

  await item.save();
  return item.toJSON();
};

export const deleteSize = async (id: number) => {
  const item = await findById(id);
  await item.destroy();
  return item;
};