import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eng AI Tools Practical Course",
  description: "Eng AI Tools Practical Course lab",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#fafafa" }}>{children}</body>
    </html>
  );
}
