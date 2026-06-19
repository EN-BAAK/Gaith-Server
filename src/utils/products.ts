import { Product } from "../models/products";
import { ProductRelationItem } from "../types/transactions";
import { ID } from "../types/variables";

export const handleProductRelations = async (
  product: Product,
  items: ProductRelationItem[] = [],
  type: "colors" | "sizes",
  createFn: (name: string) => Promise<{ id: ID }>,
  transaction?: any
) => {
  for (const item of items) {
    const method = `add${capitalize(type)}`;

    switch (item.state) {
      case "new":
        await (product as any)[method](item.id, { transaction });
        break;

      case "delete":
        await (product as any)[method.replace("add", "remove")](
          item.id,
          { transaction }
        );
        break;

      case "created":
        const created = await createFn(String(item.id));
        await (product as any)[method](created.id, { transaction });
        break;

      case "old":
        break;
    }
  }
};

const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1);