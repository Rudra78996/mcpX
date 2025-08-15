"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  className?: string;
}

export function CopyButton({ value, className }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  return (
    <button
      className={cn(
        "relative z-10 h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50",
        "inline-flex items-center justify-center rounded-md border-zinc-200 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={() => {
        navigator.clipboard.writeText(value);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
      }}
    >
      {hasCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      <span className="sr-only">Copy</span>
    </button>
  );
}
