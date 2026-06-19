import ErrorHandler from "../middlewares/error";
import { Category } from "../models/categories";

const findById = async (id: number) => {
  const item = await Category.findByPk(id);
  if (!item) throw new ErrorHandler("Category not found", 404);
  return item;
};

export const getAllCategories = async () => {
  return Category.findAll({ order: [["id", "DESC"]] });
};

export const getCategoryById = async (id: number) => {
  const item = await findById(id);
  return item.toJSON();
};

export const createCategory = async (data: { name: string }) => {
  const item = await Category.create(data);
  return item.toJSON();
};

export const updateCategory = async (id: number, data: { name?: string }) => {
  const item = await findById(id);

  if (data.name !== undefined) {
    item.name = data.name;
  }

  await item.save();
  return item.toJSON();
};

export const deleteCategory = async (id: number) => {
  const item = await findById(id);
  await item.destroy();
  return item;
};