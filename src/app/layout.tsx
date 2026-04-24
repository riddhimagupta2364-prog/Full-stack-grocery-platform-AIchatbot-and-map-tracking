
import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Snapcart | 10 min Grocery Delivery App",
  description: "10 min Grocery Delivery App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-linear-to-b from-green-100 to-white">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}