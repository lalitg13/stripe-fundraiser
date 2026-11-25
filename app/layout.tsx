import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "School Fundraiser Checkout",
  description: "Stripe test-mode checkout starter. You will implement the payment logic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
