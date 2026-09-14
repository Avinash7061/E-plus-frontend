import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jbMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E+ Health Companion",
  description: "AI-Powered Wearable Health Companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jbMono.variable}`}>
      <body className="antialiased min-h-screen bg-zinc-50 text-zinc-950 font-sans selection:bg-blue-100">
        <main className="w-full min-h-screen flex flex-col relative pb-20">
          {children}
        </main>
      </body>
    </html>
  );
}
