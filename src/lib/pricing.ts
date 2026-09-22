/**
 * Pricing utilities for Eng AI Tools Practical Course.
 *
 * KNOWN DISCOUNT CODES (for testing):
 *   SAVE20  — 20% off
 *   SAVE10  — 10% off
 *   WELCOME — 15% off
 */

const DISCOUNT_REGISTRY: Record<string, number> = {
  SAVE20: 0.2,
  SAVE10: 0.1,
  WELCOME: 0.15,
};

export function resolveDiscountRate(code: string): number {
  return DISCOUNT_REGISTRY[code.toUpperCase()] ?? 0;
}

/**
 * Applies a single percentage discount to a price.
 */
export function applyDiscount(price: number, rate: number): number {
  return price * (1 - rate);
}

export function applyDiscountCodes(
  subtotal: number,
  codes: string[]
): { discountAmount: number; total: number } {
  const discountAmount = codes.reduce(
    (discount, code) => discount + subtotal * resolveDiscountRate(code),
    0
  );
  const total = subtotal - discountAmount;
  return { discountAmount, total };
}

export function calculateSubtotal(
  items: Array<{ price: number; quantity: number }>
): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
