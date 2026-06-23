import ErrorHandler from "../middlewares/error";
import { Category } from "../models/categories";
import { CategoryCreationAttributes } from "../types/models";

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

export const createCategory = async (data: CategoryCreationAttributes) => {
  const item = await Category.create(data);
  return item.toJSON();
};

export const updateCategory = async (id: number, data: Partial<CategoryCreationAttributes>) => {
  const item = await findById(id);

  if (data.name !== undefined) {
    item.name = data.name;
  }

  if (data.icon !== undefined) {
    item.icon = data.icon;
  }

  await item.save();
  return item.toJSON();
};

export const deleteCategory = async (id: number) => {
  const item = await findById(id);
  await item.destroy();
  return item;
};