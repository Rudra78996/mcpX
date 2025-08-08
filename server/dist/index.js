import server from "./server.js";
import { startServer } from "./mcp.js";
server.listen(3000, () => {
    console.error("Express server running on port 3000");
});
startServer().catch((error) => {
    console.error("Failed to start MCP server:", error);
});
