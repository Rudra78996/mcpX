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

let extensionSocket: WebSocket | null = null;

function getExtensionSocket() {
  return extensionSocket;
}

wss.on("connection", (ws) => {
  console.error("[WS] Incoming connection");

  // Set up ping interval for this connection
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    } else {
      clearInterval(pingInterval);
    }
  }, 30000); // Send ping every 30 seconds

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === "register" && data.role === "extension") {
        extensionSocket = ws;
        ws.send(JSON.stringify({ type: "registered", role: "extension" }));
        console.error("[WS] Extension registered via WebSocket");
      }

      // Handle heartbeat messages
      if (data.type === "ping") {
        ws.send(JSON.stringify({ type: "pong", timestamp: data.timestamp }));
      }

      if (data.type === "pong") {
        console.log("Received pong from extension");
      }
    } catch (error) {
      console.error("[WS] Error parsing message:", error);
    }
  });

  ws.on("pong", () => {
    console.log("Received pong response from extension");
  });

  ws.on("error", (error) => {
    console.error("[WS] WebSocket error:", error);
    clearInterval(pingInterval);
  });

  ws.on("close", (code, reason) => {
    console.error(`[WS] Connection closed: ${code} - ${reason}`);
    clearInterval(pingInterval);
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
  const status =
    state === WebSocket.OPEN
      ? "open"
      : state === WebSocket.CONNECTING
      ? "connecting"
      : state === WebSocket.CLOSED
      ? "closed"
      : state === WebSocket.CLOSING
      ? "closing"
      : "unknown";
  res.json({
    connected: status === "open",
    status,
    timestamp: Date.now(),
    clients: wss.clients.size,
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: Date.now(),
    websocket: {
      connected: extensionSocket?.readyState === WebSocket.OPEN,
      clients: wss.clients.size,
    },
  });
});

export default server;
