import { ID } from "../types/variables";

export interface ColorAttributes {
  id: ID;
  name: string;
}

export interface ColorCreationAttributes
  extends Omit<ColorAttributes, "id"> { }

export interface SizeAttributes {
  id: ID;
  name: string;
}

export interface SizeCreationAttributes
  extends Omit<SizeAttributes, "id"> { }

export interface CategoryAttributes {
  id: ID;
  name: string;
}

export interface CategoryCreationAttributes
  extends Omit<CategoryAttributes, "id"> { }

export interface ProductAttributes {
  id: ID;

  title: string;

  categoryId: ID;
  brandId: ID;

  imgUrl?: string | null;

  summarize?: string | null;

  retailPrice: number;
  wholesalePrice: number;

  description?: string | null;
}

export interface ProductCreationAttributes
  extends Omit<ProductAttributes, "id"> { }


export interface BrandAttributes {
  id: ID;
  name: string;
  imgUrl?: string | null;
}

export interface BrandCreationAttributes
  extends Omit<BrandAttributes, "id"> { }