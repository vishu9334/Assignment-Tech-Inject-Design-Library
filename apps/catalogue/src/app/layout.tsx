import type { Metadata } from "next";
import { Fira_Code, Syne } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

const boldonse = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-boldonse",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blink Compo · Tech Inject Component Design Library",
  description:
    "Astryx-inspired enterprise component catalogue styled with Sales CRM tokens and real-time tier gating.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${firaCode.variable} ${boldonse.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] antialiased selection:bg-[#16C89E]/20 selection:text-[#16C89E] font-sans">
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
