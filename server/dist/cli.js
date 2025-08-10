#!/usr/bin/env node
import { startServer } from "./mcp.js";
import httpBridgeServer from "./server.js";
function parseArgs(argv) {
    const args = { help: false, port: undefined, noHttp: false };
    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];
        if (token === "--help" || token === "-h") {
            args.help = true;
        }
        else if (token === "--no-http") {
            args.noHttp = true;
        }
        else if (token.startsWith("--port=")) {
            const value = Number(token.split("=", 2)[1]);
            if (!Number.isNaN(value))
                args.port = value;
        }
        else if (token === "--port" || token === "-p") {
            const next = argv[i + 1];
            const value = Number(next);
            if (!Number.isNaN(value))
                args.port = value;
            i++;
        }
    }
    return args;
}
function printHelp() {
    const usage = `mcpx - Model Context Protocol server

Usage:
  mcpx [--port <number>] [--no-http]
  mcpx --help

Options:
  -h, --help        Show this help and exit
  -p, --port        Port for the HTTP bridge (default $PORT or 3000)
      --no-http     Do not start the HTTP/WebSocket bridge
`;
    console.log(usage);
}
async function main() {
    const parsed = parseArgs(process.argv.slice(2));
    if (parsed.help) {
        printHelp();
        return;
    }
    const port = parsed.port ?? (process.env.PORT ? Number(process.env.PORT) : 3000);
    if (!parsed.noHttp) {
        httpBridgeServer.on("error", (err) => {
            if (err && (err.code === "EADDRINUSE" || err.code === "EACCES")) {
                console.error(`Failed to start HTTP bridge on port ${port}: ${err.code}. Try a different port with --port.`);
                process.exit(1);
            }
            console.error("HTTP bridge error:", err);
            process.exit(1);
        });
        httpBridgeServer.listen(port, () => {
            console.error(`Express bridge running on port ${port}`);
        });
    }
    try {
        await startServer();
    }
    catch (error) {
        console.error("Failed to start MCP server:", error);
        process.exit(1);
    }
}
main();
