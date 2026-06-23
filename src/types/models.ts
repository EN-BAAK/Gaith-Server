import { ID, OrderStatus, ROLE } from "../types/variables";

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


export interface GroupBranchAttributes {
  id: ID;
  name: string;
}

export interface GroupBranchCreationAttributes extends Omit<GroupBranchAttributes, "id"> { }

export interface BranchAttributes {
  id: ID;
  name: string;
  location?: string;
  facebook?: string;
  instagram?: string;
  phone?: string;
  telephone?: string;
  groupId?: number;
}

export interface BranchCreationAttributes extends Omit<BranchAttributes, "id"> { }

export interface OrderAttributes {
  id: ID;
  userId: ID;
  status: OrderStatus,
  invoiceDiscountPercent: number;
  isPaid: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderCreationAttributes
  extends Omit<OrderAttributes, "id"> { }

export interface OrderItemAttributes {
  id: ID;
  orderId: ID;
  productId: ID;
  quantity: number;
  unitPrice: number;
  itemDiscountPercent: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItemCreationAttributes
  extends Omit<OrderItemAttributes, "id"> { }

export interface UnverifiedUserAttributes {
  id: ID;
  userId: ID;
  code: string;
  expire: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UnverifiedUserCreationAttributes extends Omit<UnverifiedUserAttributes, "id" | "createdAt" | "updatedAt"> { }

export interface UserAttributes {
  id: ID;
  name: string;
  email: string;
  phone: string;
  role: ROLE
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Omit<UserAttributes, "id"> { }


export interface PasswordResetAttributes {
  id?: ID;
  userId: ID;
  code: string;
  expiresAt: Date;
  isVerified: boolean;
}

export interface PasswordCreationResetAttributes extends Omit<PasswordResetAttributes, "id" | "isVerified"> { }