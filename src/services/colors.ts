import ErrorHandler from "../middlewares/error";
import { Color } from "../models/colors";

const findById = async (id: number) => {
  const item = await Color.findByPk(id);
  if (!item) throw new ErrorHandler("Color not found", 404);
  return item;
};

export const getAllColors = async () => {
  return Color.findAll({ order: [["id", "DESC"]] });
};

export const getColorById = async (id: number) => {
  const item = await findById(id);
  return item.toJSON();
};

export const createColor = async (data: { name: string }) => {
  const item = await Color.create(data);
  return item.toJSON();
};

export const updateColor = async (id: number, data: { name?: string }) => {
  const item = await findById(id);

  if (data.name !== undefined) {
    item.name = data.name;
  }

  await item.save();
  return item.toJSON();
};

export const deleteColor = async (id: number) => {
  const item = await findById(id);
  await item.destroy();
  return item;
};