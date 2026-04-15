import { CartItem } from "@/types";

export function validateCartItems(items: unknown[]): CartItem[] {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty or invalid");
  }

  return items.map((item, i) => {
    if (
      typeof item !== "object" ||
      item === null ||
      typeof (item as Record<string, unknown>).productId !== "string" ||
      typeof (item as Record<string, unknown>).name !== "string" ||
      typeof (item as Record<string, unknown>).price !== "number" ||
      typeof (item as Record<string, unknown>).quantity !== "number"
    ) {
      throw new Error(`Invalid cart item at index ${i}`);
    }
    return item as CartItem;
  });
}
