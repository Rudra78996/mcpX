"use client";
import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileSidebarProps {
  navSections: Array<{
    title: string;
    items: Array<{
      href: string;
      label: string;
    }>;
  }>;
}

export default function MobileSidebar({ navSections }: MobileSidebarProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-zinc-950 border-zinc-800">
        <SheetHeader>
          <SheetTitle className="text-zinc-100">Navigation</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-2">
              <h4 className="text-sm font-semibold text-zinc-200 px-2">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-2 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
