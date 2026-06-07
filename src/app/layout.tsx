import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "QuadBrand — AI-Powered Brand Visuals in Seconds",
  description:
    "Generate stunning, on-brand marketing visuals in seconds. Paste your brand URL, and let AI create scroll-stopping designs at half the price of competitors.",
  keywords: [
    "AI brand design",
    "marketing visuals",
    "brand identity",
    "AI image generation",
    "on-brand content",
  ],
  openGraph: {
    title: "QuadBrand — AI-Powered Brand Visuals in Seconds",
    description:
      "Generate stunning, on-brand marketing visuals in seconds with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
