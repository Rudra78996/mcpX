import { ensureExtension, makeRequest } from "./base.js";
export function createUtilityHandlers(getExtensionSocket) {
    return [
        {
            path: "/wait",
            method: "POST",
            handler: (req, res) => {
                const extensionSocket = getExtensionSocket();
                if (!ensureExtension(extensionSocket, res))
                    return;
                const { type, value, timeout, tabId } = req.body || {};
                if (!type || value === undefined) {
                    return res.status(400).json({ error: "Missing type or value" });
                }
                makeRequest(extensionSocket, "wait", { type, value, timeout, tabId }, "wait-result", res);
            },
        },
        {
            path: "/press-key",
            method: "POST",
            handler: (req, res) => {
                const extensionSocket = getExtensionSocket();
                if (!ensureExtension(extensionSocket, res))
                    return;
                const { key, modifiers, tabId } = req.body || {};
                if (!key)
                    return res.status(400).json({ error: "Missing key" });
                makeRequest(extensionSocket, "press-key", { key, modifiers, tabId }, "press-key-result", res);
            },
        },
        {
            path: "/screenshot",
            method: "POST",
            handler: (req, res) => {
                const extensionSocket = getExtensionSocket();
                if (!ensureExtension(extensionSocket, res))
                    return;
                const { format, quality, fullPage, tabId } = req.body || {};
                makeRequest(extensionSocket, "screenshot", { format, quality, fullPage, tabId }, "screenshot-result", res);
            },
        },
        {
            path: "/console-logs",
            method: "POST",
            handler: (req, res) => {
                const extensionSocket = getExtensionSocket();
                if (!ensureExtension(extensionSocket, res))
                    return;
                const { tabId, levels, since, limit } = req.body || {};
                makeRequest(extensionSocket, "console-logs", { tabId, levels, since, limit }, "console-logs-result", res);
            },
        },
    ];
}
