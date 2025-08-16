import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createNavigationHandlers } from "./handlers/navigation.js";
import { createInteractionHandlers } from "./handlers/interaction.js";
import { createUtilityHandlers } from "./handlers/utility.js";
import { createSnapshotHandlers } from "./handlers/snapshot.js";
import { createScreenshotHandlers } from "./handlers/screenshot.js";
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Hello from MCPX server");
});
const server = createServer(app);
const wss = new WebSocketServer({ server });
let extensionSocket = null;
function getExtensionSocket() {
    return extensionSocket;
}
wss.on("connection", (ws) => {
    console.error("[WS] Incoming connection");
    ws.on("message", (message) => {
        const data = JSON.parse(message.toString());
        if (data.type === "register" && data.role === "extension") {
            extensionSocket = ws;
            ws.send(JSON.stringify({ type: "registered", role: "extension" }));
            console.error("[WS] Extension registered via WebSocket");
        }
    });
    ws.on("close", () => {
        if (ws === extensionSocket) {
            extensionSocket = null;
            console.error("[WS] Extension disconnected");
        }
    });
});
// Register all modular handlers
const allHandlers = [
    ...createNavigationHandlers(getExtensionSocket),
    ...createInteractionHandlers(getExtensionSocket),
    ...createUtilityHandlers(getExtensionSocket),
    ...createSnapshotHandlers(getExtensionSocket),
    ...createScreenshotHandlers(getExtensionSocket),
];
// Register handlers with Express
for (const handler of allHandlers) {
    switch (handler.method) {
        case "GET":
            app.get(handler.path, handler.handler);
            break;
        case "POST":
            app.post(handler.path, handler.handler);
            break;
        case "PUT":
            app.put(handler.path, handler.handler);
            break;
        case "DELETE":
            app.delete(handler.path, handler.handler);
            break;
    }
}
app.get("/ws-status", (_req, res) => {
    const state = extensionSocket?.readyState;
    const status = state === WebSocket.OPEN
        ? "open"
        : state === WebSocket.CONNECTING
            ? "connecting"
            : state === WebSocket.CLOSED
                ? "closed"
                : state === WebSocket.CLOSING
                    ? "closing"
                    : "unknown";
    res.json({ connected: status === "open", status });
});
export default server;
