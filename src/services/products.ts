import { Op } from "sequelize";
import db from "../models";
import ErrorHandler from "../middlewares/error";
import { Product } from "../models/products";
import { ID, ROLE } from "../types/variables"
import { ProductCreationAttributes } from "../types/models";
import { handleProductRelations } from "../utils/products";
import { Color } from "../models/colors";
import { Size } from "../models/sizes";
import { ProductRelationsInput } from "../types/transactions";
import fs from "fs"
import { Category } from "../models/categories";
import { Brand } from "../models/brands";

const findProductById = async (id: ID, properties: boolean = false) => {
  const product = await Product.findByPk(id, {
    include:
      properties ?
        [
          { model: Category, as: "category", attributes: ["name"] },
          { model: Brand, as: "brand", attributes: ["name", "id"] },
          { model: Color, as: "colors", attributes: ["name", "id"] },
          { model: Size, as: "sizes", attributes: ["name", "id"] },
        ] : [],
  });

  if (!product) {
    throw new ErrorHandler("Product not found", 404);
  }

  return product;
};

const findProductByIdSettings = async (id: ID) => {
  const product = await Product.findByPk(id, {
    include: [
      { model: Category, as: "category", attributes: ["name"] },
      { model: Brand, as: "brand", attributes: ["name", "id"] },
      { model: Color, as: "colors", attributes: ["name", "id"] },
      { model: Size, as: "sizes", attributes: ["name", "id"] },
    ],
  });

  if (!product) {
    throw new ErrorHandler("Product not found", 404);
  }

  return mapProductSettings(product);
};

const mapProduct = (product: any, role?: ROLE) => {
  const json = product.toJSON();

  return {
    id: json.id,
    title: json.title,
    description: json.description,
    summarize: json.summarize,
    price:
      role === ROLE.WHOLESALE
        ? json.wholesalePrice
        : json.retailPrice,

    categoryId: undefined,
    brandId: undefined,

    category: json.category
      ? {
        id: json.category.id,
        name: json.category.name
      }
      : null,

    brand: json.brand
      ? {
        id: json.brand.id,
        name: json.brand.name,
        imgUrl: json.brand.imgUrl
      }
      : null,

    colors: json.colors?.map((c: any) => ({ name: c.name })) || [],
    sizes: json.sizes?.map((s: any) => ({ name: s.name })) || [],
  };
};

const mapProductSettings = (product: any) => {
  const json = product.toJSON();

  return {
    ...json,

    categoryId: undefined,
    brandId: undefined,

    imgUrl: json.imgUrl,

    category: json.category
      ? {
        id: json.category.id,
        name: json.category.name
      }
      : null,

    brand: json.brand
      ? {
        id: json.brand.id,
        name: json.brand.name,
        imgUrl: json.brand.imgUrl
      }
      : null,

    colors: json.colors?.map((c: any) => ({ id: c.id, name: c.name })) || [],
    sizes: json.sizes?.map((s: any) => ({ id: s.id, name: s.name })) || [],
  };
};

export const getAllProducts = async (
  page: number,
  limit: number,
  search?: string,
  categoryId?: ID,
  brandId?: ID,
  role?: ROLE
) => {
  const offset = (page - 1) * limit;

  const where: any = {};

  if (search) {
    where.title = { [Op.like]: `%${search}%` };
  }

  if (categoryId) where.categoryId = categoryId;
  if (brandId) where.brandId = brandId;

  const { count, rows } = await Product.findAndCountAll({
    where,
    limit,
    offset,
    order: [["id", "DESC"]],
    include: [
      { model: Category, as: "category", attributes: ["name"] },
      { model: Color, as: "colors", attributes: ["name"] },
      { model: Size, as: "sizes", attributes: ["name"] },
    ],
  });

  return {
    count,
    rows: rows.map((p) => mapProduct(p, role)),
  };
};

export const getAllProductsSettings = async (
  page: number,
  limit: number,
  offsetUnit: number,
  search?: string
) => {
  const offset = (page - 1) * limit + offsetUnit;

  const where: any = {};

  if (search) {
    where.title = { [Op.like]: `%${search}%` };
  }

  const { rows, count } = await Product.findAndCountAll({
    where,
    limit,
    offset,
    order: [["id", "DESC"]],
    include: [
      { model: Category, as: "category" },
      { model: Brand, as: "brand" },
      { model: Color, as: "colors" },
      { model: Size, as: "sizes" },
    ],
  });

  const products = rows.map(p => mapProductSettings(p))
  return { rows: products, count }
};

export const getProductById = async (id: ID, role?: ROLE) => {
  const product = await findProductById(id, true);
  return mapProduct(product, role);
};

export const getProductByIdSettings = async (id: ID) => {
  return findProductByIdSettings(id);
};

export const createProduct = async (
  data: ProductCreationAttributes,
  image?: Express.Multer.File,
  relations?: ProductRelationsInput
) => {
  if (!db || !db.sequelize) return;
  const t = await db.sequelize.transaction();

  try {
    const imgUrl = image
      ? `uploads/products/${image.filename}`
      : null;

    const product = await Product.create(
      { ...data, imgUrl },
      { transaction: t }
    );

    if (relations?.colors) {
      await handleProductRelations(
        product,
        relations.colors,
        "colors",
        t
      );
    }

    if (relations?.sizes) {
      await handleProductRelations(
        product,
        relations.sizes,
        "sizes",
        t
      );
    }

    await t.commit();

    return product.toJSON();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

export const updateProduct = async (
  id: ID,
  data: Partial<ProductCreationAttributes> & { removeImage?: boolean },
  image?: Express.Multer.File,
  relations?: ProductRelationsInput
) => {
  if (!db || !db.sequelize) return;
  const t = await db.sequelize.transaction();

  try {
    const product = await findProductById(id);

    if (image) {
      if (product.imgUrl && fs.existsSync(product.imgUrl)) {
        fs.unlinkSync(product.imgUrl);
      }
      product.imgUrl = `uploads/products/${image.filename}`
    } else if (data.removeImage) {
      if (product.imgUrl && fs.existsSync(product.imgUrl)) {
        fs.unlinkSync(product.imgUrl);
      }
      product.imgUrl = null;
    }

    Object.assign(product, data);

    await product.save({ transaction: t });

    if (relations?.colors) {
      await handleProductRelations(
        product,
        relations.colors,
        "colors",
        t
      );
    }

    if (relations?.sizes) {
      await handleProductRelations(
        product,
        relations.sizes,
        "sizes",
        t
      );
    }

    await t.commit();

    return product.toJSON();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

export const deleteProductById = async (id: ID) => {
  const product = await findProductById(id);
  await product.destroy();
  return product;
};