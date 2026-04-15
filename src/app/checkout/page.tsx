"use client";

import { useState } from "react";
import type { CartItem, CheckoutResult } from "@/types";

const DEMO_CART: CartItem[] = [
  { productId: "prod_001", name: "TypeScript Handbook", price: 49.99, quantity: 1 },
  { productId: "prod_002", name: "Mechanical Keyboard", price: 149.99, quantity: 1 },
];

export default function CheckoutPage() {
  const [discountCode, setDiscountCode] = useState("");
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: DEMO_CART,
          discountCodes: discountCode ? [discountCode] : [],
        }),
      });

      const data: CheckoutResult = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error ?? "Checkout failed");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  const subtotal = DEMO_CART.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main style={{ maxWidth: 480, margin: "60px auto", fontFamily: "system-ui", padding: "0 24px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Checkout</h1>
      <p style={{ color: "#666", marginBottom: 32 }}>Eng AI Tools Practical Course</p>

      <ul style={{ listStyle: "none", padding: 0, marginBottom: 24 }}>
        {DEMO_CART.map((item) => (
          <li key={item.productId} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
            <span>{item.name} × {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div style={{ marginBottom: 24 }}>
        <label htmlFor="discount" style={{ display: "block", marginBottom: 6, fontSize: 14 }}>
          Discount code
        </label>
        <input
          id="discount"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
          placeholder="e.g. SAVE20"
          style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, fontSize: 14, boxSizing: "border-box" }}
        />
        <p style={{ fontSize: 12, color: "#999", marginTop: 4 }}>Try: SAVE20, SAVE10, WELCOME</p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 600, marginBottom: 24 }}>
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{ width: "100%", padding: "12px", background: loading ? "#aaa" : "#0070f3", color: "#fff", border: "none", borderRadius: 8, fontSize: 16, cursor: loading ? "not-allowed" : "pointer" }}
      >
        {loading ? "Processing..." : "Place order"}
      </button>

      {error && (
        <div style={{ marginTop: 16, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 6, color: "#b91c1c", fontSize: 14 }}>
          {error}
        </div>
      )}

      {result?.ok && (
        <div style={{ marginTop: 16, padding: "12px 16px", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 6, color: "#15803d", fontSize: 14 }}>
          Order placed! ID: <code>{result.orderId}</code><br />
          Total: <strong>${result.total?.toFixed(2)}</strong>
        </div>
      )}
    </main>
  );
}
