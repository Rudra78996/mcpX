import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
export async function createServer() {
    const server = new McpServer({
        name: "mcpX",
        version: "1.1.0",
        capabilities: {
            resources: {},
            tools: {},
        },
    });
    // Register all tools individually (MCP framework requires individual registration)
    // Import all tool functions
    const { takeScreenshot } = await import("./tools/screenshot.js");
    const { scrollPage } = await import("./tools/scroll.js");
    const { wait } = await import("./tools/wait.js");
    const { navigateToUrl } = await import("./tools/navigation.js");
    const { goBack, goForward } = await import("./tools/history.js");
    const { pressKey } = await import("./tools/keyboard.js");
    const { takeSnapshot } = await import("./tools/snapshot.js");
    const { clickElement, hoverElement } = await import("./tools/interaction.js");
    const { typeText } = await import("./tools/text-input.js");
    const { getConsoleLogs } = await import("./tools/console.js");
    // Screenshot tool
    server.tool("screenshot", "Take a screenshot of the current page. Options: format (png/jpeg), quality (0-100), fullPage (boolean).", {
        format: z.enum(["png", "jpeg"]).optional().default("png"),
        quality: z.number().min(0).max(100).optional().default(90),
        fullPage: z.boolean().optional().default(false),
        tabId: z.number().optional(),
    }, takeScreenshot);
    // Scroll tool
    server.tool("tab-scroll", "Scroll the page or a specific element. Supports directions: up, down, left, right, top (scroll to top), bottom (scroll to bottom). Optionally specify a CSS selector to scroll within a specific element, distance in pixels, and tabId.", {
        direction: z.enum(["up", "down", "left", "right", "top", "bottom"]),
        distance: z.number().optional().default(300),
        tabId: z.number().optional(),
        selector: z.string().optional(),
        timeoutMs: z.number().optional().default(5000),
    }, scrollPage);
    // Wait tool
    server.tool("wait", "Wait for a specified condition. Types: 'time' (milliseconds), 'element' (CSS selector), 'navigation' (URL pattern)", {
        type: z.enum(["time", "element", "navigation"]),
        value: z
            .any()
            .describe("For type 'time': number (milliseconds), for 'element'/'navigation': string (selector/URL pattern)"),
        timeout: z.number().default(30000),
        tabId: z.number().optional(),
    }, async ({ type, value, timeout, tabId, }) => {
        // Ensure value is provided since it's actually required
        if (value === undefined || value === null) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Value is required for wait type: ${type}`,
                    },
                ],
                isError: true,
            };
        }
        // Convert string numbers to actual numbers for time type
        let processedValue = value;
        if (type === "time" && typeof value === "string") {
            const numValue = Number(value);
            if (isNaN(numValue)) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Invalid time value: ${value}. Must be a number.`,
                        },
                    ],
                    isError: true,
                };
            }
            processedValue = numValue;
        }
        return await wait({ type, value: processedValue, timeout, tabId });
    });
    // Navigation tool
    server.tool("open-tab", "Open a new browser tab to the given URL. Pass active=true to focus it.", {
        url: z.string().url(),
        active: z.boolean().optional().default(true),
    }, navigateToUrl);
    // History tools
    server.tool("tab-back", "Go back in the active tab's history. Optionally pass tabId.", {
        tabId: z.number().optional(),
    }, goBack);
    server.tool("tab-forward", "Go forward in the active tab's history. Optionally pass tabId.", {
        tabId: z.number().optional(),
    }, goForward);
    // Keyboard tool
    server.tool("press-key", "Press a key or key combination on the keyboard. Supports modifiers: ctrl, alt, shift, meta", {
        key: z.string().min(1),
        ctrl: z.boolean().optional().default(false),
        alt: z.boolean().optional().default(false),
        shift: z.boolean().optional().default(false),
        meta: z.boolean().optional().default(false),
        tabId: z.number().optional(),
    }, pressKey);
    // Snapshot tool
    server.tool("snapshot", "Take a DOM snapshot of the current page with optional interactive elements detection", {
        url: z.string().url(),
        includeInteractive: z.boolean().optional().default(true),
    }, takeSnapshot);
    // Interaction tools
    server.tool("tab-click", "Click an element in the current tab by CSS selector. Optionally pass tabId.", {
        selector: z.string().min(1),
        tabId: z.number().optional(),
        timeoutMs: z.number().optional().default(5000),
    }, clickElement);
    server.tool("hover", "Hover over an element in the current tab by CSS selector. Optionally pass tabId.", {
        selector: z.string().min(1),
        tabId: z.number().optional(),
        timeoutMs: z.number().optional().default(5000),
    }, hoverElement);
    // Text input tool
    server.tool("type-text", "Type text into an element or the active element. Optionally specify a CSS selector to target a specific element.", {
        text: z.string(),
        selector: z.string().optional(),
        tabId: z.number().optional(),
        delay: z.number().optional().default(50),
    }, typeText);
    // Console logs tool
    server.tool("console-logs", "Get console logs from the current tab. Optionally filter by levels and time range.", {
        levels: z
            .array(z.enum(["log", "info", "warn", "error", "debug"]))
            .optional()
            .default(["log", "info", "warn", "error"]),
        limit: z.number().optional().default(100),
        since: z.number().optional(),
        tabId: z.number().optional(),
    }, getConsoleLogs);
    // Keep the legacy x-factor tool for backward compatibility
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
    const server = await createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    // Use console.error for logging so it doesn't interfere with stdio protocol
    console.error("Server running on stdio");
}
