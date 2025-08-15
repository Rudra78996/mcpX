"use client";
import * as React from "react";
import { Command } from "cmdk";
import Link from "next/link";
import { Search, FileText, Hash, ExternalLink } from "lucide-react";

interface SearchItem {
  href: string;
  label: string;
  description?: string;
  category: string;
}

const searchItems: SearchItem[] = [
  {
    href: "/docs/welcome",
    label: "Welcome",
    description: "Welcome to MCPX documentation",
    category: "Getting Started",
  },
  {
    href: "/docs/setup-server",
    label: "Setup MCP Server",
    description: "Configure the MCP server component",
    category: "Setup",
  },
  {
    href: "/docs/setup-extension",
    label: "Setup Browser Extension",
    description: "Install and configure the browser extension",
    category: "Setup",
  },
  {
    href: "/docs/start-automating",
    label: "Start Automating",
    description: "Begin automating with MCPX",
    category: "Usage",
  },
  {
    href: "/docs/troubleshooting",
    label: "Troubleshooting",
    description: "Common issues and solutions",
    category: "Help",
  },
];

export default function DocsSearch({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const modalRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  // Handle click outside to close modal
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Auto-focus input when modal opens
  React.useEffect(() => {
    if (open && inputRef.current) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const filteredItems = React.useMemo(() => {
    if (!search) return searchItems;
    return searchItems.filter(
      (item) =>
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const groupedItems = React.useMemo(() => {
    const groups: Record<string, SearchItem[]> = {};
    filteredItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 pt-4 sm:pt-[10vh]">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60" />

          {/* Search Modal */}
          <div ref={modalRef} className="relative w-full max-w-2xl">
            <Command className="overflow-hidden rounded-lg sm:rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">
              {/* Search Input */}
              <div className="flex items-center border-b border-zinc-800 px-3 sm:px-4">
                <Search className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-zinc-400" />
                <Command.Input
                  ref={inputRef}
                  placeholder="Search documentation..."
                  value={search}
                  onValueChange={setSearch}
                  className="flex h-10 sm:h-12 w-full bg-transparent text-sm sm:text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                  autoFocus
                />
                <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-zinc-700 bg-zinc-800/50 px-2 font-mono text-xs text-zinc-400">
                  ESC
                </kbd>
              </div>

              {/* Search Results */}
              <Command.List className="max-h-[300px] sm:max-h-[400px] overflow-y-auto p-1 sm:p-2">
                <Command.Empty className="py-6 sm:py-8 text-center">
                  <FileText className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-zinc-500 mb-2" />
                  <p className="text-sm sm:text-base text-zinc-300">
                    No results found for &quot;{search}&quot;
                  </p>

                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Try searching for different keywords
                  </p>
                </Command.Empty>

                {Object.entries(groupedItems).map(([category, items]) => (
                  <Command.Group key={category} className="mb-2 sm:mb-3">
                    <div className="mx-1 sm:mx-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800/50 mb-1 sm:mb-2">
                      {category}
                    </div>
                    {items.map((item) => (
                      <Command.Item
                        key={item.href}
                        value={`${item.label} ${item.description} ${item.category}`}
                        className="group relative flex cursor-pointer select-none items-center rounded-md mx-1 sm:mx-2 mb-1 px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm outline-none hover:bg-zinc-800 data-[selected]:bg-zinc-800 transition-colors"
                        onSelect={() => {
                          setOpen(false);
                          setSearch("");
                        }}
                      >
                        <Link
                          href={item.href}
                          className="flex w-full items-center gap-2 sm:gap-3"
                        >
                          <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md bg-zinc-800 border border-zinc-700 flex-shrink-0">
                            <Hash className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-zinc-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-zinc-200 group-hover:text-white group-data-[selected]:text-white leading-tight text-sm sm:text-base">
                              {item.label}
                            </div>
                            {item.description && (
                              <div className="text-xs text-zinc-500 mt-0.5 truncate group-hover:text-zinc-400 group-data-[selected]:text-zinc-400 leading-relaxed">
                                {item.description}
                              </div>
                            )}
                          </div>
                          <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-600 opacity-0 group-hover:opacity-100 group-data-[selected]:opacity-100 group-hover:text-zinc-400 group-data-[selected]:text-zinc-400 transition-all flex-shrink-0" />
                        </Link>
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>

              {/* Footer */}
              <div className="border-t border-zinc-800 px-2 sm:px-4 py-2 sm:py-3 bg-zinc-900/50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 text-xs text-zinc-500">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-1">
                      <kbd className="h-4 w-4 sm:h-5 sm:w-5 rounded border border-zinc-700 bg-zinc-800/60 flex items-center justify-center text-zinc-400 text-xs">
                        ↑
                      </kbd>
                      <kbd className="h-4 w-4 sm:h-5 sm:w-5 rounded border border-zinc-700 bg-zinc-800/60 flex items-center justify-center text-zinc-400 text-xs">
                        ↓
                      </kbd>
                      <span className="text-zinc-500 hidden sm:inline">
                        navigate
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="h-4 sm:h-5 px-1 sm:px-2 rounded border border-zinc-700 bg-zinc-800/60 flex items-center justify-center text-zinc-400 text-xs">
                        ↵
                      </kbd>
                      <span className="text-zinc-500 hidden sm:inline">
                        select
                      </span>
                    </div>
                  </div>
                  <div className="text-zinc-500 hidden sm:block">
                    Press Ctrl+K to search
                  </div>
                </div>
              </div>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
