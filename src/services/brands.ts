import fs from "fs";
import ErrorHandler from "../middlewares/error";
import { Brand } from "../models/brands";
import { BrandCreationAttributes } from "../types/models";
import { ID } from "../types/variables";

const findBrandById = async (id: ID) => {
  const brand = await Brand.findByPk(id);

  if (!brand) {
    throw new ErrorHandler("Brand not found", 404);
  }

  return brand;
};

export const getAllBrands = async () => {
  return Brand.findAll({
    order: [["id", "DESC"]],
  });
};

export const getBrandById = async (id: ID) => {
  const brand = await findBrandById(id);
  return brand.toJSON();
};

export const createBrand = async (
  data: BrandCreationAttributes,
  image?: Express.Multer.File
) => {
  const imgUrl = image
    ? `uploads/brands/${image.filename}`
    : null;

  const brand = await Brand.create({
    ...data,
    imgUrl,
  });

  return brand.toJSON();
};

export const updateBrand = async (
  id: ID,
  data: Partial<BrandCreationAttributes>,
  image?: Express.Multer.File
) => {
  const brand = await findBrandById(id);

  if (image) {
    if (brand.imgUrl && fs.existsSync(brand.imgUrl)) {
      fs.unlinkSync(brand.imgUrl);
    }

    brand.imgUrl = `uploads/brands/${image.filename}`;
  }

  if (data.name !== undefined) {
    brand.name = data.name;
  }

  await brand.save();

  return brand.toJSON();
};

export const deleteBrandById = async (id: ID) => {
  const brand = await findBrandById(id);
  await brand.destroy();
  return brand;
};