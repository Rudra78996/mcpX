import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Browser MCPX",
  description:
    "Connect AI apps to your browser to automate tests and tasks with Browser MCPX.",
  metadataBase: new URL("https://localhost"),
  openGraph: {
    title: "Browser MCPX",
    description:
      "Connect AI apps to your browser to automate tests and tasks with Browser MCPX.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
