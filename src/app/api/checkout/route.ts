import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveOrder } from "@/lib/db";
import { applyDiscountCodes, calculateSubtotal } from "@/lib/pricing";
import { createPaymentIntent } from "@/lib/payments";
import { validateCartItems } from "@/lib/cart";
import { randomUUID } from "crypto";

const CheckoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
    })
  ).min(1),
  discountCodes: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = CheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { items: rawItems, discountCodes } = parsed.data;

  try {
    const items = validateCartItems(rawItems);
    const subtotal = calculateSubtotal(items);
    const { discountAmount, total } = applyDiscountCodes(subtotal, discountCodes);

    const orderId = randomUUID();

    const payment = await createPaymentIntent({
      amount: total,
      currency: "USD",
      orderId,
    });

    if (!payment.success) {
      return NextResponse.json({ ok: false, error: "Payment failed" });
    }

    saveOrder({
      id: orderId,
      itemsJson: JSON.stringify(items),
      subtotal,
      discount: discountAmount,
      total,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { ok: true, orderId, total },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message });
  }
}
