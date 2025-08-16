#!/usr/bin/env node
import { startServer as startMcpServer } from "./mcp.js";
import httpBridgeServer from "./server.js";
startMcpServer().then(() => {
    console.error("🔧 MCP Server started successfully");
}).catch(console.error);
httpBridgeServer.listen(3000, () => {
    console.error("🌐 HTTP Bridge Server started on port 3000");
});
