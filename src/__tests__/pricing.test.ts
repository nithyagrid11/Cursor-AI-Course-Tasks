import { describe, it, expect } from "@jest/globals";
import {
  applyDiscount,
  applyDiscountCodes,
  calculateSubtotal,
  resolveDiscountRate,
} from "@/lib/pricing";
import { CartItem } from "@/types";

describe("resolveDiscountRate", () => {
  it("returns the correct rate for known codes", () => {
    expect(resolveDiscountRate("SAVE20")).toBe(0.2);
    expect(resolveDiscountRate("SAVE10")).toBe(0.1);
    expect(resolveDiscountRate("WELCOME")).toBe(0.15);
  });

  it("returns 0 for unknown codes", () => {
    expect(resolveDiscountRate("BOGUS")).toBe(0);
  });

  it("matches known codes case-insensitively", () => {
    expect(resolveDiscountRate("save20")).toBe(0.2);
  });
});

describe("applyDiscount", () => {
  it("applies a single discount correctly", () => {
    expect(applyDiscount(100, 0.2)).toBe(80);
  });

  it("leaves the price unchanged for a zero rate", () => {
    expect(applyDiscount(100, 0)).toBe(100);
  });

  it("reduces the price to zero for a full discount", () => {
    expect(applyDiscount(100, 1)).toBe(0);
  });
});

describe("calculateSubtotal", () => {
  it("sums price × quantity", () => {
    expect(calculateSubtotal([{ price: 10, quantity: 2 }, { price: 5, quantity: 1 }])).toBe(25);
  });

  it("does not add zero-quantity items to the subtotal", () => {
    const items: CartItem[] = [
      { productId: "unused", name: "Unused", price: 100, quantity: 0 },
      { productId: "active", name: "Active", price: 25, quantity: 2 },
    ];

    expect(calculateSubtotal(items)).toBe(50);
  });

  it("returns zero for an empty item array", () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  it("calculates decimal prices and quantities", () => {
    expect(calculateSubtotal([{ price: 19.99, quantity: 3 }])).toBeCloseTo(
      59.97
    );
  });
});

describe("applyDiscountCodes — stacked discounts", () => {
  it("should give $70 for SAVE20 + SAVE10 on $100", () => {
    const { total } = applyDiscountCodes(100, ["SAVE20", "SAVE10"]);
    expect(total).toBe(70);
  });

  it("stacks three or more codes against the original subtotal", () => {
    const result = applyDiscountCodes(100, ["SAVE20", "SAVE10", "WELCOME"]);

    expect(result.discountAmount).toBe(45);
    expect(result.total).toBe(55);
  });

  it("ignores unknown codes while applying valid ones", () => {
    const result = applyDiscountCodes(100, ["UNKNOWN", "SAVE20", "BOGUS"]);

    expect(result.discountAmount).toBe(20);
    expect(result.total).toBe(80);
  });

  it("leaves the subtotal unchanged when the code array is empty", () => {
    expect(applyDiscountCodes(100, [])).toEqual({
      discountAmount: 0,
      total: 100,
    });
  });

  it("returns zero discount and total for a zero subtotal", () => {
    expect(applyDiscountCodes(0, ["SAVE20", "SAVE10"])).toEqual({
      discountAmount: 0,
      total: 0,
    });
  });
});
