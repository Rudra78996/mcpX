import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "mcpX Documentation",
  description: "Complete documentation for mcpX browser automation tools.",
  icons: {
    icon: "/fvc.png",
  },
};

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body
        className={`flex flex-col min-h-screen ${inter.variable} font-sans`}
      >
        <RootProvider
          theme={{
            enabled: true,
            storageKey: "fumadocs-theme",
            defaultTheme: "system",
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
