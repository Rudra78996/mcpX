import { ensureExtension, makeRequest } from "./base.js";
export function createScreenshotHandlers(getExtensionSocket) {
    return [
        {
            path: "/screenshot",
            method: "POST",
            handler: (req, res) => {
                const extensionSocket = getExtensionSocket();
                if (!ensureExtension(extensionSocket, res))
                    return;
                const { format = "png", quality = 90, fullPage = false, tabId, } = req.body || {};
                makeRequest(extensionSocket, "screenshot", { format, quality, fullPage, tabId }, "screenshot-result", res);
            },
        },
    ];
}
