import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { CartItem, CheckoutPayload, CheckoutResult } from "@/types";

interface StoredOrder {
  id: string;
  items_json: string;
  subtotal: number;
  discount: number;
  total: number;
  created_at: string;
}

const databaseDirectory = mkdtempSync(path.join(tmpdir(), "checkout-api-"));
process.env.DATABASE_URL = path.join(databaseDirectory, "orders.db");

let postCheckout: (request: NextRequest) => Promise<NextResponse>;
let getOrder: (id: string) => Record<string, unknown> | undefined;

function checkoutRequest(body: string): NextRequest {
  return new NextRequest("http://localhost/api/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
}

describe("POST /api/checkout", () => {
  beforeAll(async () => {
    ({ POST: postCheckout } = await import("@/app/api/checkout/route"));
    ({ getOrder } = await import("@/lib/db"));
  });

  afterAll(() => {
    rmSync(databaseDirectory, { recursive: true, force: true });
  });

  it("returns 201 and persists a valid checkout", async () => {
    const items: CartItem[] = [
      { productId: "keyboard", name: "Keyboard", price: 100, quantity: 2 },
    ];
    const payload: CheckoutPayload = { items, discountCodes: ["SAVE20"] };

    const response = await postCheckout(
      checkoutRequest(JSON.stringify(payload))
    );
    const result = (await response.json()) as CheckoutResult;

    expect(response.status).toBe(201);
    expect(result).toMatchObject({ ok: true, total: 160 });
    expect(result.orderId).toEqual(expect.any(String));

    const storedOrder = getOrder(result.orderId as string) as
      | StoredOrder
      | undefined;
    expect(storedOrder).toMatchObject({
      id: result.orderId,
      subtotal: 200,
      discount: 40,
      total: 160,
    });
    expect(JSON.parse(storedOrder?.items_json ?? "[]")).toEqual(items);
  });

  it("returns 422 for an empty items array", async () => {
    const payload: CheckoutPayload = { items: [], discountCodes: [] };

    const response = await postCheckout(
      checkoutRequest(JSON.stringify(payload))
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toMatchObject({ ok: false });
  });

  it("returns 400 for an invalid JSON body", async () => {
    const response = await postCheckout(checkoutRequest("{"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: "Invalid JSON body",
    });
  });

  it("returns 422 for malformed cart item objects", async () => {
    const response = await postCheckout(
      checkoutRequest(
        JSON.stringify({
          items: [{ productId: "keyboard", price: 100, quantity: 1 }],
          discountCodes: [],
        })
      )
    );

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toMatchObject({ ok: false });
  });
});
