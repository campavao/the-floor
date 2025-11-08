import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Floor",
  description: "Play The Floor at home",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "The Floor",
    description: "Play The Floor at home",
    url: "https://thefloor.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Floor",
    description: "Play The Floor at home",
    images: ["https://thefloor.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
