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
let extensionSocket = null;

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        const data = JSON.parse(message.toString());
        if (data.type === "register" && data.role === "extension") {
            extensionSocket = ws;
            ws.send(JSON.stringify({ type: "registered", role: "extension" }));
            console.error("Extension registered via WebSocket");
        }
    });
    ws.on("close", () => {
        if (ws === extensionSocket) {
            extensionSocket = null;
            console.error("Extension disconnected");
        }
    });
});
app.post("/snapshot", async (req, res) => {
    if (!extensionSocket || extensionSocket.readyState !== WebSocket.OPEN) {
        return res.status(503).json({ error: "Extension not connected" });
    }
    const { url } = req.body;
    const requestId = Math.random().toString(36).substring(2, 15);
    const handleMessage = (message) => {
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
export default server;
