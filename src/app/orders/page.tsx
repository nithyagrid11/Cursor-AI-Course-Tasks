"use client";

import { useEffect, useState } from "react";
import type { Order, OrdersResponse } from "@/types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOrders(): Promise<void> {
      try {
        const response = await fetch("/api/orders", {
          signal: controller.signal,
        });
        const data: OrdersResponse = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data.error ?? "Unable to load orders");
        }

        setOrders(data.orders ?? []);
      } catch (loadError) {
        if (loadError instanceof Error && loadError.name === "AbortError") {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load orders"
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadOrders();
    return () => controller.abort();
  }, []);

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "60px auto",
        fontFamily: "system-ui",
        padding: "0 24px",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 600 }}>Order history</h1>

      {loading && <p style={{ color: "#666" }}>Loading orders...</p>}

      {error && (
        <div
          role="alert"
          style={{
            marginTop: 24,
            padding: "12px 16px",
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: 6,
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <p style={{ color: "#666" }}>No orders found.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div style={{ overflowX: "auto", marginTop: 24 }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                {[
                  "Order ID",
                  "Items",
                  "Subtotal",
                  "Discount",
                  "Total",
                  "Date",
                ].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    style={{ padding: 12, borderBottom: "2px solid #ddd" }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td
                    title={order.id}
                    style={{ padding: 12, borderBottom: "1px solid #eee" }}
                  >
                    <code>{order.id.slice(0, 8)}...</code>
                  </td>
                  <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    {order.items
                      .map((item) => `${item.name} × ${item.quantity}`)
                      .join(", ")}
                  </td>
                  <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    {formatCurrency(order.subtotal)}
                  </td>
                  <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    {formatCurrency(order.discount)}
                  </td>
                  <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    {formatCurrency(order.total)}
                  </td>
                  <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
