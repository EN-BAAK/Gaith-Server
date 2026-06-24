import { ID } from "./variables";

export type ProductRelationState =
  "new" | "remove" | "old" | "created";

export interface ProductRelationItem {
  id: ID;
  state: ProductRelationState;
}

export interface ProductRelationsInput {
  colors?: ProductRelationItem[];
  sizes?: ProductRelationItem[];
}

export type OrderItemState = "new" | "old" | "edit" | "remove";

export interface OrderItemInput {
  id?: ID;
  productId?: ID;
  quantity?: number;
  itemDiscountPercent?: number;
  state: OrderItemState;
}

export interface OrderItemsInput {
  items?: OrderItemInput[];
}