import type { Metadata } from "next";
import "./globals.css";
import Recorder from "../components/Recorder";

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
      <body>
        {children}
        {/* Session recorder. Renders nothing until armed with ?rec=1 -
            see components/Recorder.tsx and lib/recorder.ts. */}
        <Recorder />
      </body>
    </html>
  );
}
