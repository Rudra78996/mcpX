import { Request, Response } from "express";
import { WebSocket } from "ws";

export interface RequestHandler {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  handler: (req: Request, res: Response) => void;
}

export function ensureExtension(
  extensionSocket: WebSocket | null,
  res: Response
): boolean {
  if (!extensionSocket || extensionSocket.readyState !== WebSocket.OPEN) {
    res.status(503).json({ error: "Extension not connected" });
    return false;
  }
  return true;
}

export function makeRequest(
  extensionSocket: WebSocket,
  type: string,
  payload: any,
  expectType: string,
  res: Response,
  timeoutMs = 10000
) {
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
