import { CartItem } from "@/types";

export function validateCartItems(items: unknown[]): CartItem[] {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty or invalid");
  }

  return items.map((item, i) => {
    const candidate = item as Record<string, unknown>;
    if (
      typeof item !== "object" ||
      item === null ||
      typeof candidate.productId !== "string" ||
      typeof candidate.name !== "string" ||
      typeof candidate.price !== "number" ||
      !Number.isFinite(candidate.price) ||
      candidate.price < 0 ||
      typeof candidate.quantity !== "number" ||
      !Number.isInteger(candidate.quantity) ||
      candidate.quantity <= 0
    ) {
      throw new Error(`Invalid cart item at index ${i}`);
    }
    return item as CartItem;
  });
}
