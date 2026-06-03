import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Overclock AIOps — Group Selector",
  description: "Choose your AI Ops Cohort 2 huddle group",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-dark">{children}</body>
    </html>
  );
}
