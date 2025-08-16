import { Request, Response } from "express";
import { WebSocket } from "ws";
import { ensureExtension, makeRequest, RequestHandler } from "./base.js";

export function createNavigationHandlers(
  getExtensionSocket: () => WebSocket | null
): RequestHandler[] {
  return [
    {
      path: "/open-tab",
      method: "POST",
      handler: (req: Request, res: Response) => {
        const extensionSocket = getExtensionSocket();
        if (!ensureExtension(extensionSocket, res)) return;

        const { url, active } = req.body || {};
        if (!url) return res.status(400).json({ error: "Missing url" });

        makeRequest(
          extensionSocket!,
          "open-tab",
          { url, active: Boolean(active) },
          "open-tab-result",
          res
        );
      },
    },
    {
      path: "/tab-back",
      method: "POST",
      handler: (req: Request, res: Response) => {
        const extensionSocket = getExtensionSocket();
        if (!ensureExtension(extensionSocket, res)) return;

        const { tabId } = req.body || {};
        makeRequest(
          extensionSocket!,
          "tab-back",
          { tabId },
          "tab-back-result",
          res
        );
      },
    },
    {
      path: "/tab-forward",
      method: "POST",
      handler: (req: Request, res: Response) => {
        const extensionSocket = getExtensionSocket();
        if (!ensureExtension(extensionSocket, res)) return;

        const { tabId } = req.body || {};
        makeRequest(
          extensionSocket!,
          "tab-forward",
          { tabId },
          "tab-forward-result",
          res
        );
      },
    },
  ];
}
