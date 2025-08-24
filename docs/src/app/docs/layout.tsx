import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import Link from "next/link";
import Image from "next/image";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout 
      tree={source.pageTree} 
      nav={{ 
        enabled: true,
        title: (
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="mcpX" 
              width={32} 
              height={32}
              className="dark:invert transition-all duration-200" 
            />
            <span className="font-sans text-xl font-bold tracking-tight leading-none text-zinc-700 dark:text-zinc-200 transition-colors hover:text-zinc-900 dark:hover:text-white">
              mcp
              <span className="italic">X</span>
            </span>
          </Link>
        ),
        url: "/",
      }}
    >
      {children}
    </DocsLayout>
  );
}
