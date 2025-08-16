import { Request, Response } from "express";
import { WebSocket } from "ws";
import { ensureExtension, makeRequest, RequestHandler } from "./base.js";

export function createScreenshotHandlers(
  getExtensionSocket: () => WebSocket | null
): RequestHandler[] {
  return [
    {
      path: "/screenshot",
      method: "POST",
      handler: (req: Request, res: Response) => {
        const extensionSocket = getExtensionSocket();
        if (!ensureExtension(extensionSocket, res)) return;

        const {
          format = "png",
          quality = 90,
          fullPage = false,
          tabId,
        } = req.body || {};

        makeRequest(
          extensionSocket!,
          "screenshot",
          { format, quality, fullPage, tabId },
          "screenshot-result",
          res
        );
      },
    },
  ];
}
