"use client";

import { useEffect, useRef, useState } from "react";
import { CopyButton } from "./copy-button";

interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
}

export function CodeBlock({
  children,
  language = "javascript",
  className,
}: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    const highlight = async () => {
      if (codeRef.current && !isHighlighted) {
        try {
          const Prism = (await import("prismjs")).default;

          const cleanLang = language.replace(/^language-/, "");
          const mappedLanguage = getLanguageMapping(cleanLang);

          try {
            if (mappedLanguage === "javascript" || mappedLanguage === "js") {
              await import("prismjs/components/prism-javascript");
            }
            if (mappedLanguage === "typescript" || mappedLanguage === "ts") {
              await import("prismjs/components/prism-typescript");
            }
            if (mappedLanguage === "jsx") {
              await import("prismjs/components/prism-jsx");
            }
            if (mappedLanguage === "tsx") {
              await import("prismjs/components/prism-tsx");
            }
            if (mappedLanguage === "python" || mappedLanguage === "py") {
              await import("prismjs/components/prism-python");
            }
            if (mappedLanguage === "json") {
              await import("prismjs/components/prism-json");
            }
            if (mappedLanguage === "bash" || mappedLanguage === "shell") {
              await import("prismjs/components/prism-bash");
            }
            if (mappedLanguage === "css") {
              await import("prismjs/components/prism-css");
            }
          } catch {
            // Ignore missing language component
          }

          Prism.highlightElement(codeRef.current);
          setIsHighlighted(true);
        } catch (error) {
          console.warn(
            `Prism highlighting failed for language: ${language}`,
            error
          );
        }
      }
    };

    if (typeof window !== "undefined") {
      highlight();
    }
  }, [children, language, isHighlighted]);

  const getLanguageMapping = (lang: string): string => {
    const languageMap: Record<string, string> = {
      html: "markup",
      xml: "markup",
      svg: "markup",
      mathml: "markup",
      js: "javascript",
      ts: "typescript",
      py: "python",
      sh: "bash",
      shell: "bash",
      zsh: "bash",
      fish: "bash",
      cmd: "bash",
    };

    return languageMap[lang] || lang;
  };

  const cleanLanguage = language.replace(/^language-/, "");
  const mappedLanguage = getLanguageMapping(cleanLanguage);

  return (
    <div className="relative group">
      <pre
        className="mb-4 mt-6 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm font-mono"
        style={{
          WebkitTapHighlightColor: "transparent",
          fontFamily: '"Fira Code", monospace',
        }}
      >
        <code
          ref={codeRef}
          className={`language-${mappedLanguage} text-zinc-100 ${className || ""}`}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {children}
        </code>
      </pre>
      <CopyButton
        value={children}
        className="absolute right-2 top-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
      />
    </div>
  );
}
