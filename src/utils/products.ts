import { Product } from "../models/products";
import { ProductRelationItem } from "../types/transactions";

export const handleProductRelations = async (product: Product,items: any,type: "colors" | "sizes",transaction?: any) => {
  const singularType = capitalize(type.slice(0, -1));
  const addMethod = `add${singularType}`;
  const removeMethod = `remove${singularType}`;

  const parsedItems: ProductRelationItem[] = typeof items === "string"
    ? JSON.parse(items)
    : items;

  for (const item of parsedItems) {
    const targetId = Number(item.id);

    switch (item.state) {
      case "new":
        await (product as any)[addMethod](targetId, { transaction });
        break;

      case "remove":
        await (product as any)[removeMethod](targetId, { transaction });
        break;

      case "old":
        break;
    }
  }
};
const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1);