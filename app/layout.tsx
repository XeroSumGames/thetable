import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Table — character generators by Xero Sum Games",
  description:
    "A free, always-open table for tabletop character generators and tools. No account, no cost.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
