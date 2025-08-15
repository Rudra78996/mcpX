import type { MDXComponents } from "mdx/types";
import { CopyButton } from "@/components/copy-button";
import { CodeBlock } from "@/components/code-block";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, className, ...props }) => (
      <h1
        className="scroll-m-20 text-3xl font-bold tracking-tight text-zinc-100 mb-4 border-b border-zinc-800 pb-2"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, className, ...props }) => (
      <h2
        className="scroll-m-20 text-2xl font-semibold tracking-tight text-zinc-100 mb-3 mt-8 first:mt-0"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, className, ...props }) => (
      <h3
        className="scroll-m-20 text-xl font-semibold tracking-tight text-zinc-100 mb-2 mt-6"
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, className, ...props }) => (
      <h4
        className="scroll-m-20 text-lg font-semibold tracking-tight text-zinc-100 mb-2 mt-4"
        {...props}
      >
        {children}
      </h4>
    ),
    p: ({ children, className, ...props }) => (
      <p className="leading-7 text-zinc-300 mb-4 text-sm" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, className, ...props }) => (
      <ul
        className="my-4 ml-6 list-disc text-zinc-300 text-sm [&>li]:mt-1"
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, className, ...props }) => (
      <ol
        className="my-4 ml-6 list-decimal text-zinc-300 text-sm [&>li]:mt-1"
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, className, ...props }) => (
      <li className="leading-6" {...props}>
        {children}
      </li>
    ),
    code: ({ children, className, ...props }) => {
      // Handle inline code (no language class)
      if (!className || !className.startsWith("language-")) {
        return (
          <code
            className="relative rounded bg-zinc-800 px-[0.3rem] py-[0.2rem] font-mono text-sm text-zinc-100"
            {...props}
          >
            {children}
          </code>
        );
      }

      // For code blocks, let the pre component handle highlighting
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    pre: ({ children, ...props }) => {
      // Check if this is a code block with language
      const codeElement = Array.isArray(children) ? children[0] : children;

      if (codeElement && typeof codeElement === "object" && codeElement.props) {
        const { className, children: codeChildren } = codeElement.props;

        if (className && className.startsWith("language-")) {
          const language = className.replace("language-", "");
          const codeContent =
            typeof codeChildren === "string"
              ? codeChildren
              : String(codeChildren);

          // Use the CodeBlock component for syntax highlighting
          return <CodeBlock language={language}>{codeContent}</CodeBlock>;
        }
      }

      // Fallback for regular pre blocks
      const getTextContent = (node: any): string => {
        if (typeof node === "string") return node;
        if (Array.isArray(node)) return node.map(getTextContent).join("");
        if (node?.props?.children) return getTextContent(node.props.children);
        return "";
      };

      const textContent = getTextContent(children);

      return (
        <div className="relative group my-6">
          <pre
            className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm font-mono"
            {...props}
          >
            {children}
          </pre>
          {textContent && (
            <CopyButton
              value={textContent}
              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            />
          )}
        </div>
      );
    },
    blockquote: ({ children, className, ...props }) => (
      <blockquote
        className="mt-6 border-l-2 border-zinc-600 pl-6 italic text-zinc-400 text-sm"
        {...props}
      >
        {children}
      </blockquote>
    ),
    table: ({ children, className, ...props }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table
          className="w-full border-collapse border border-zinc-800 text-sm"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    tr: ({ children, className, ...props }) => (
      <tr
        className="m-0 border-t border-zinc-800 p-0 even:bg-zinc-900/50"
        {...props}
      >
        {children}
      </tr>
    ),
    th: ({ children, className, ...props }) => (
      <th
        className="border border-zinc-800 px-4 py-2 text-left font-bold text-zinc-100 bg-zinc-800/50 [&[align=center]]:text-center [&[align=right]]:text-right"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, className, ...props }) => (
      <td
        className="border border-zinc-800 px-4 py-2 text-left text-zinc-300 [&[align=center]]:text-center [&[align=right]]:text-right"
        {...props}
      >
        {children}
      </td>
    ),
    strong: ({ children, className, ...props }) => (
      <strong className="font-semibold text-zinc-100" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, className, ...props }) => (
      <em className="italic text-zinc-300" {...props}>
        {children}
      </em>
    ),
    a: ({ href, children, className, ...props }) => (
      <a
        href={href}
        className="font-medium text-blue-400 underline underline-offset-4 hover:text-blue-300 transition-colors"
        {...props}
      >
        {children}
      </a>
    ),
    hr: ({ className, ...props }) => (
      <hr className="my-4 border-zinc-800 md:my-8" {...props} />
    ),
    ...components,
  };
}
