import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

export function createServer() {
  const server = new McpServer({
    name: "mcpX",
    version: "1.0.0",
    capabilities: {
      resources: {},
      tools: {},
    },
  });

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
      const snapshot = "this is the test snapshot of the page";
      return {
        content: [
          {
            type: "text",
            text: `This is the ${snapshot} snapshot of the current page`,
          },
        ],
      };
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

startServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
