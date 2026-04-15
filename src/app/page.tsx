import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 480, margin: "60px auto", fontFamily: "system-ui", padding: "0 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600 }}>Eng AI Tools Practical Course</h1>
      <p style={{ color: "#666" }}>Incident lab — checkout is broken.</p>
      <Link href="/checkout" style={{ display: "inline-block", marginTop: 24, padding: "10px 20px", background: "#0070f3", color: "#fff", borderRadius: 8, textDecoration: "none" }}>
        Go to checkout
      </Link>
    </main>
  );
}
