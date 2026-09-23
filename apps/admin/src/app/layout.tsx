import type { Metadata } from "next";
import "./globals.css";
import { AdminAuthProvider } from "@/context/AdminAuthContext";

export const metadata: Metadata = {
  title: "Admin Dashboard · Tech Inject Design Library",
  description: "Administrative portal to manage component publishing and customer access tier permissions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] antialiased">
        <AdminAuthProvider>{children}</AdminAuthProvider>
      </body>
    </html>
  );
}
