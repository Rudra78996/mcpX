import Link from "next/link";
import { ReactNode } from "react";
import { Search, Github } from "lucide-react";
import DocsSearch from "./search";
import MobileSidebar from "./mobile-sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  const navSections = [
    {
      title: "Getting Started",
      items: [
        { href: "/docs", label: "Overview" },
        { href: "/docs/welcome", label: "Welcome" },
        { href: "/docs/installation", label: "Installation" },
      ],
    },
    {
      title: "Setup",
      items: [
        { href: "/docs/setup-server", label: "MCP Server" },
        { href: "/docs/setup-extension", label: "Browser Extension" },
        { href: "/docs/configuration", label: "Configuration" },
      ],
    },
    {
      title: "Usage",
      items: [
        { href: "/docs/start-automating", label: "Start Automating" },
        { href: "/docs/api-reference", label: "API Reference" },
        { href: "/docs/examples", label: "Examples" },
      ],
    },
    {
      title: "Help",
      items: [{ href: "/docs/troubleshooting", label: "Troubleshooting" }],
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/75">
        <div className="mx-auto flex h-14 items-center px-4 md:px-6 lg:px-8">
          {/* Mobile Menu */}
          <div className="mr-4 md:hidden">
            <MobileSidebar navSections={navSections} />
          </div>

          <Link
            href="/"
            className="mr-4 md:mr-6 flex items-center space-x-2 text-sm font-medium"
          >
            <span className="text-zinc-400 hover:text-zinc-100 transition-colors">
              ← Back
            </span>
          </Link>

          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <DocsSearch>
                <button className="inline-flex items-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 hover:text-zinc-50 h-9 px-3 md:px-4 py-2 relative w-full justify-start rounded-md text-sm font-normal text-zinc-400 shadow-none sm:pr-12 md:w-40 lg:w-64">
                  <Search className="mr-2 h-4 w-4" />
                  <span className="hidden lg:inline-flex">
                    Search documentation...
                  </span>
                  <span className="inline-flex lg:hidden">Search...</span>
                  <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-400 opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </button>
              </DocsSearch>
            </div>
            <Link
              href="https://github.com/Rudra78996/mcpX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 hover:text-zinc-50 h-9 w-9"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-screen-2xl">
        <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-0 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-0">
          {/* Desktop Sidebar */}
          <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block md:w-[220px] lg:w-[240px]">
            <div className="h-full py-6 pl-4 pr-0 md:pl-6 md:pr-0 lg:pl-8 lg:pr-0 overflow-hidden">
              <div className="w-full">
                {navSections.map((section) => (
                  <div key={section.title} className="pb-4">
                    <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold text-zinc-200">
                      {section.title}
                    </h4>
                    <div className="grid grid-flow-row auto-rows-max text-sm">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="relative py-4 px-4 md:py-6 md:pl-0 md:pr-6 lg:pr-8">
            <div className="mx-auto w-full min-w-0 max-w-none md:max-w-3xl">
              <div className="prose prose-zinc prose-invert max-w-none prose-headings:scroll-m-20 prose-headings:font-semibold prose-h1:text-3xl prose-h1:font-bold prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:leading-7 prose-a:font-medium prose-a:text-zinc-100 prose-a:underline prose-a:decoration-zinc-500 hover:prose-a:decoration-zinc-300 prose-blockquote:border-l-zinc-700 prose-blockquote:text-zinc-400 prose-strong:text-zinc-100 prose-code:text-zinc-100 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-th:text-zinc-100 prose-td:text-zinc-300">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
