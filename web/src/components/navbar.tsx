"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full bg-background mt-4">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 sm:px-8 lg:px-24">
        {/* Left: Logo + Name (link to home) */}
        <Link
          href="/"
          aria-label="Go to homepage"
          className="flex items-center gap-3 group"
        >
          <Image src="/logo.png" alt="mcpX" width={50} height={50} />
          <span className="font-sans text-2xl md:text-3xl font-bold tracking-tight leading-none text-zinc-700 mb-1 transition-colors group-hover:text-zinc-900">
            mcp
            <span className="italic">X</span>
          </span>
        </Link>

        {/* Right: GitHub Button (shadcn) */}
        <Button variant="outline" size="lg" asChild>
          <Link
            href="https://github.com/Rudra78996/mcpX"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <Github className="h-5 w-5" />
            GitHub
          </Link>
        </Button>
      </div>
    </header>
  );
}
