import { describe, expect, it } from "@jest/globals";
import { validateCartItems } from "@/lib/cart";
import { CartItem } from "@/types";

describe("validateCartItems", () => {
  const validItem: CartItem = {
    productId: "keyboard",
    name: "Keyboard",
    price: 79.99,
    quantity: 1,
  };

  it("returns a valid cart with multiple items", () => {
    const items: CartItem[] = [
      validItem,
      { productId: "mouse", name: "Mouse", price: 29.99, quantity: 2 },
    ];

    expect(validateCartItems(items)).toEqual(items);
  });

  it("throws when the cart is empty", () => {
    expect(() => validateCartItems([])).toThrow("Cart is empty or invalid");
  });

  it("throws when the cart value is not an array", () => {
    expect(() =>
      validateCartItems(null as unknown as unknown[])
    ).toThrow("Cart is empty or invalid");
  });

  it("throws when a cart item is missing required fields", () => {
    const malformedItems: unknown[] = [
      { productId: "keyboard", name: "Keyboard", price: 79.99 },
    ];

    expect(() => validateCartItems(malformedItems)).toThrow(
      "Invalid cart item at index 0"
    );
  });

  it("throws when a cart item has a negative price", () => {
    const items: CartItem[] = [
      { productId: "refund", name: "Invalid item", price: -10, quantity: 1 },
    ];

    expect(() => validateCartItems(items)).toThrow(
      "Invalid cart item at index 0"
    );
  });

  it.each([
    ["a primitive value", "keyboard"],
    ["null", null],
    ["a non-string product ID", { ...validItem, productId: 123 }],
    ["a non-string name", { ...validItem, name: false }],
    ["a non-number price", { ...validItem, price: "79.99" }],
    ["a NaN price", { ...validItem, price: Number.NaN }],
    ["an infinite price", { ...validItem, price: Number.POSITIVE_INFINITY }],
    ["a non-number quantity", { ...validItem, quantity: "1" }],
    ["a fractional quantity", { ...validItem, quantity: 1.5 }],
    ["a zero quantity", { ...validItem, quantity: 0 }],
    ["a negative quantity", { ...validItem, quantity: -1 }],
  ])("throws when an item contains %s", (_description, invalidItem) => {
    expect(() => validateCartItems([invalidItem])).toThrow(
      "Invalid cart item at index 0"
    );
  });

  it("reports the index of an invalid item", () => {
    expect(() => validateCartItems([validItem, { ...validItem, price: -1 }])).toThrow(
      "Invalid cart item at index 1"
    );
  });

  it("accepts a free item with a zero price", () => {
    const freeItem: CartItem = { ...validItem, price: 0 };

    expect(validateCartItems([freeItem])).toEqual([freeItem]);
  });
});
