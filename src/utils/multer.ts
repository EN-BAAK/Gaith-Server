import path from "path"
import multer from "multer"

const ProductsStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads/products");

  },
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${Date.now()}-${file.fieldname}${ext}`);
  },
});

export const uploadProductImage = multer({ storage: ProductsStorage });

const BrandsImage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads/brands");

  },
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${Date.now()}-${file.fieldname}${ext}`);
  },
});

export const uploadBrandImage = multer({ storage: BrandsImage });