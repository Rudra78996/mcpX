import { ensureExtension, makeRequest } from "./base.js";
export function createInteractionHandlers(getExtensionSocket) {
    return [
        {
            path: "/tab-click",
            method: "POST",
            handler: (req, res) => {
                const extensionSocket = getExtensionSocket();
                if (!ensureExtension(extensionSocket, res))
                    return;
                const { selector, tabId, timeoutMs } = req.body || {};
                if (!selector)
                    return res.status(400).json({ error: "Missing selector" });
                makeRequest(extensionSocket, "tab-click", { selector, tabId, timeoutMs }, "tab-click-result", res);
            },
        },
        {
            path: "/hover",
            method: "POST",
            handler: (req, res) => {
                const extensionSocket = getExtensionSocket();
                if (!ensureExtension(extensionSocket, res))
                    return;
                const { selector, tabId, timeoutMs } = req.body || {};
                if (!selector)
                    return res.status(400).json({ error: "Missing selector" });
                makeRequest(extensionSocket, "hover", { selector, tabId, timeoutMs }, "hover-result", res);
            },
        },
        {
            path: "/type-text",
            method: "POST",
            handler: (req, res) => {
                const extensionSocket = getExtensionSocket();
                if (!ensureExtension(extensionSocket, res))
                    return;
                const { text, selector, delay, tabId } = req.body || {};
                if (text === undefined || text === null) {
                    return res.status(400).json({ error: "Missing text" });
                }
                makeRequest(extensionSocket, "type-text", { text, selector, delay, tabId }, "type-text-result", res);
            },
        },
        {
            path: "/scroll",
            method: "POST",
            handler: (req, res) => {
                const extensionSocket = getExtensionSocket();
                if (!ensureExtension(extensionSocket, res))
                    return;
                const { direction, distance, tabId, selector, timeoutMs } = req.body || {};
                if (!direction) {
                    return res.status(400).json({ error: "Missing direction" });
                }
                makeRequest(extensionSocket, "scroll", { direction, distance, tabId, selector, timeoutMs }, "scroll-result", res);
            },
        },
    ];
}
