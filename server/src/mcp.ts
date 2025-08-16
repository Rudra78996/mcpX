import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { allToolDefs } from "./tools/index.js";

export function createServer() {
  const server = new McpServer({
    name: "mcpX",
    version: "1.1.0",
    capabilities: {
      resources: {},
      tools: {},
    },
  });

  // Register all tools from the modular structure
  for (const toolDef of allToolDefs) {
    server.tool(
      toolDef.name,
      toolDef.description,
      toolDef.schema,
      toolDef.handler
    );
  }

  // Keep the legacy x-factor tool for backward compatibility
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

  return server;
}

export async function startServer() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Use console.error for logging so it doesn't interfere with stdio protocol
  console.error("Server running on stdio");
}
