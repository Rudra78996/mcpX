import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
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
      <body className={`${inter.variable} ${firaCode.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
