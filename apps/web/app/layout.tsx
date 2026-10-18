import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Vibe App" };

/** Root layout. Time: O(1); Space: O(children). */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
