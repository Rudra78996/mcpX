import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from MCPX server");
});

const server = createServer(app);
const wss = new WebSocketServer({ server });

let extensionSocket : any = null;

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

app.post("/snapshot", async (req, res) => {
    if (!extensionSocket || extensionSocket.readyState !== WebSocket.OPEN) {
        return res.status(503).json({ error: "Extension not connected" });
    }

    const { url } = req.body;
    const requestId = Math.random().toString(36).substring(2, 15);

    const handleMessage = (message : any) => {
        const data = JSON.parse(message.toString());
        if (data.type === "snapshot-result" && data.requestId === requestId) {
            clearTimeout(timeout);
            extensionSocket.off("message", handleMessage);
            res.json({ result: data.result });
        }
    };

    const timeout = setTimeout(() => {
        extensionSocket.off("message", handleMessage);
        res.status(504).json({ error: "Snapshot request timed out" });
    }, 10000); 

    extensionSocket.on("message", handleMessage);

    extensionSocket.send(JSON.stringify({ type: "snapshot", url, requestId }));
});

function ensureExtension(res: any) {
  if (!extensionSocket || extensionSocket.readyState !== WebSocket.OPEN) {
    res.status(503).json({ error: "Extension not connected" });
    return false;
  }
  return true;
}

function makeRequest(type: string, payload: any, expectType: string, res: any, timeoutMs = 10000) {
  if (!ensureExtension(res)) return;

  console.error(`[HTTP] ${type} -> forwarding to extension`, payload);
  const requestId = Math.random().toString(36).slice(2);
  const handleMessage = (message: any) => {
    const data = JSON.parse(message.toString());
    if (data.type === expectType && data.requestId === requestId) {
      clearTimeout(timeout);
      extensionSocket!.off("message", handleMessage);
      console.error(`[HTTP] ${type} <- response from extension`, data);
      res.json(data);
    }
  };
  const timeout = setTimeout(() => {
    extensionSocket!.off("message", handleMessage);
    console.error(`[HTTP] ${type} timed out waiting for extension`);
    res.status(504).json({ error: `${type} request timed out` });
  }, timeoutMs);
  extensionSocket!.on("message", handleMessage);
  try {
    extensionSocket!.send(JSON.stringify({ type, requestId, ...payload }));
  } catch (e) {
    clearTimeout(timeout);
    extensionSocket!.off("message", handleMessage);
    console.error(`[HTTP] ${type} failed to send to extension`, e);
    res.status(500).json({ error: `Failed to send ${type} to extension` });
  }
}

app.post("/open-tab", (req, res) => {
  const { url, active } = req.body || {};
  if (!url) return res.status(400).json({ error: "Missing url" });
  makeRequest("open-tab", { url, active: Boolean(active) }, "open-tab-result", res);
});

app.post("/tab-click", (req, res) => {
  const { selector, tabId, timeoutMs } = req.body || {};
  if (!selector) return res.status(400).json({ error: "Missing selector" });
  makeRequest("tab-click", { selector, tabId, timeoutMs }, "tab-click-result", res);
});

app.post("/tab-back", (req, res) => {
  const { tabId } = req.body || {};
  makeRequest("tab-back", { tabId }, "tab-back-result", res);
});

app.post("/tab-forward", (req, res) => {
  const { tabId } = req.body || {};
  makeRequest("tab-forward", { tabId }, "tab-forward-result", res);
});

app.get("/ws-status", (_req, res) => {
  const state = extensionSocket?.readyState;
  const status = state === WebSocket.OPEN ? "open" : state === WebSocket.CONNECTING ? "connecting" : state === WebSocket.CLOSED ? "closed" : state === WebSocket.CLOSING ? "closing" : "unknown";
  res.json({ connected: status === "open", status });
});

export default server;