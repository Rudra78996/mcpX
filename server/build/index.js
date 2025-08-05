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
    server.tool("get-x-factor", "This function returns the x factor of two numbers", {
        a: z.number(),
        b: z.number(),
    }, async ({ a, b }) => {
        return {
            content: [
                {
                    type: "text",
                    text: `sum of ${a} and ${b} is ${a + b}`,
                },
            ],
        };
    });
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
