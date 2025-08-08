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
    server.tool("snapshot", "This Function provide the dom snapshot of the current page", {
        url: z.string().url(),
    }, async ({ url }) => {
        try {
            const res = await fetch("http://localhost:3000/snapshot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            });
            const data = await res.json();
            const snapshotString = data.result;
            console.error("Fetched data for snapshot:", data.toString());
            return {
                content: [
                    {
                        type: "text",
                        text: `This is the data : ${snapshotString} for the snapshot of ${url}`,
                    },
                ],
            };
        }
        catch (err) {
            console.error("Error fetching snapshot data:", err);
            return {
                content: [
                    {
                        type: "text",
                        text: "This is a placeholder for the snapshot data ",
                    },
                ],
            };
        }
    });
    return server;
}
export async function startServer() {
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Server running on stdio");
}
