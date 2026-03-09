import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Update this section for your branding
// src/app/layout.tsx
export const metadata: Metadata = {
  title: "HabitFlow",
  description: "Setting up your flow...",
  icons: {
    icon: "/icon.png", // Next.js will find this automatically
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F8FAFC] text-slate-900`}>
        {/* Main content wrapper */}
        <main className="min-h-screen">
          {children}
        </main>
        
        {/* Sonner Toaster for your notifications */}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}