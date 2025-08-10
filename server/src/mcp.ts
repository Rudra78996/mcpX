import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

export function createServer() {
  const server = new McpServer({
    name: "mcpX",
    version: "1.1.0",
    capabilities: {
      resources: {},
      tools: {},
    },
  });

  async function postJson(url: string, body: any, timeoutMs = 10000): Promise<any> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        return { status: res.status, text };
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  server.tool(
    "get-x-factor",
    "This function returns the x factor of two numbers",
    {
      a: z.number(),
      b: z.number(),
    },
    async ({ a, b }: { a: number; b: number }) => {
      return {
        content: [
          {
            type: "text",
            text: `sum of ${a} and ${b} is ${a + b}`,
          },
        ],
      };
    }
  );
  server.tool(
    "snapshot",
    "This Function provide the dom snapshot of the current page",
    {
      url: z.string().url(),
    },
    async ({ url }: { url: string }) => {
      try {
        const data = await postJson("http://localhost:3000/snapshot", { url });
        return { content: [{ type: "text", text: JSON.stringify({ url, data }) }] };
      } catch (err: any) {
        return { content: [{ type: "text", text: `snapshot error: ${String(err?.message || err)}` }] };
      }
    }
  );

  server.tool(
    "open-tab",
    "Open a new browser tab to the given URL. Pass active=true to focus it.",
    { url: z.string().url(), active: z.boolean().optional() },
    async ({ url, active }: { url: string; active?: boolean }) => {
      try {
        const data = await postJson("http://localhost:3000/open-tab", { url, active });
        return { content: [{ type: "text", text: JSON.stringify(data) }] };
      } catch (err: any) {
        return { content: [{ type: "text", text: `open-tab error: ${String(err?.message || err)}` }] };
      }
    }
  );

  server.tool(
    "tab-click",
    "Click an element in the current tab by CSS selector. Optionally pass tabId.",
    { selector: z.string(), tabId: z.number().optional() },
    async ({ selector, tabId }: { selector: string; tabId?: number }) => {
      try {
        const data = await postJson("http://localhost:3000/tab-click", { selector, tabId });
        return { content: [{ type: "text", text: JSON.stringify(data) }] };
      } catch (err: any) {
        return { content: [{ type: "text", text: `tab-click error: ${String(err?.message || err)}` }] };
      }
    }
  );

  server.tool(
    "tab-back",
    "Go back in the active tab's history. Optionally pass tabId.",
    { tabId: z.number().optional() },
    async ({ tabId }: { tabId?: number }) => {
      try {
        const data = await postJson("http://localhost:3000/tab-back", { tabId });
        return { content: [{ type: "text", text: JSON.stringify(data) }] };
      } catch (err: any) {
        return { content: [{ type: "text", text: `tab-back error: ${String(err?.message || err)}` }] };
      }
    }
  );

  server.tool(
    "tab-forward",
    "Go forward in the active tab's history. Optionally pass tabId.",
    { tabId: z.number().optional() },
    async ({ tabId }: { tabId?: number }) => {
      try {
        const data = await postJson("http://localhost:3000/tab-forward", { tabId });
        return { content: [{ type: "text", text: JSON.stringify(data) }] };
      } catch (err: any) {
        return { content: [{ type: "text", text: `tab-forward error: ${String(err?.message || err)}` }] };
      }
    }
  );

  return server;
}

export async function startServer() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Server running on stdio");
}
