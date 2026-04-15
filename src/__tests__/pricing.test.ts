import { describe, it, expect } from "@jest/globals";
import {
  applyDiscount,
  applyDiscountCodes,
  calculateSubtotal,
  resolveDiscountRate,
} from "@/lib/pricing";

describe("resolveDiscountRate", () => {
  it("returns the correct rate for known codes", () => {
    expect(resolveDiscountRate("SAVE20")).toBe(0.2);
    expect(resolveDiscountRate("SAVE10")).toBe(0.1);
    expect(resolveDiscountRate("WELCOME")).toBe(0.15);
  });

  it("returns 0 for unknown codes", () => {
    expect(resolveDiscountRate("BOGUS")).toBe(0);
  });
});

describe("applyDiscount", () => {
  it("applies a single discount correctly", () => {
    expect(applyDiscount(100, 0.2)).toBe(80);
  });
});

describe("calculateSubtotal", () => {
  it("sums price × quantity", () => {
    expect(calculateSubtotal([{ price: 10, quantity: 2 }, { price: 5, quantity: 1 }])).toBe(25);
  });
});

describe("applyDiscountCodes — stacked discounts", () => {
  it("should give $70 for SAVE20 + SAVE10 on $100", () => {
    const { total } = applyDiscountCodes(100, ["SAVE20", "SAVE10"]);
    expect(total).toBe(70);
  });
});
