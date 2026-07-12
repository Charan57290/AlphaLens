import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlphaLens AI | Premium Investment Research",
  description: "AI-powered investment research agent analyzing companies, financials, news, and risks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} dark antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#030712]">
        {/* Animated Background Mesh */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-emerald-900/10 blur-[120px] animate-pulse" style={{ animationDuration: '7s' }} />
          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-teal-900/10 blur-[120px] animate-pulse" style={{ animationDuration: '9s' }} />
          <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-emerald-600/10 blur-[120px] animate-pulse" style={{ animationDuration: '11s' }} />
        </div>
        {children}
      </body>
    </html>
  );
}
