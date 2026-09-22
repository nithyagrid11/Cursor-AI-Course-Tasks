import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRecentOrders } from "@/lib/db";
import type { Order } from "@/types";

const LimitSchema = z.coerce.number().int().min(1).max(50).default(10);

const OrderItemsSchema = z.array(
  z.object({
    productId: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })
);

export async function GET(req: NextRequest): Promise<NextResponse> {
  const parsedLimit = LimitSchema.safeParse(
    req.nextUrl.searchParams.get("limit") ?? undefined
  );

  if (!parsedLimit.success) {
    return NextResponse.json(
      { ok: false, error: "Limit must be an integer between 1 and 50" },
      { status: 400 }
    );
  }

  try {
    const orders: Order[] = getRecentOrders(parsedLimit.data).map((row) => ({
      id: row.id,
      items: OrderItemsSchema.parse(JSON.parse(row.itemsJson) as unknown),
      subtotal: row.subtotal,
      discount: row.discount,
      total: row.total,
      createdAt: row.createdAt,
    }));

    return NextResponse.json({ ok: true, orders }, { status: 200 });
  } catch (error) {
    console.error("Failed to load recent orders", error);
    return NextResponse.json(
      { ok: false, error: "Unable to load orders" },
      { status: 500 }
    );
  }
}
