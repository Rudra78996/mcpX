import { ensureExtension } from "./base.js";
export function createSnapshotHandlers(getExtensionSocket) {
    return [
        {
            path: "/snapshot",
            method: "POST",
            handler: async (req, res) => {
                const extensionSocket = getExtensionSocket();
                if (!ensureExtension(extensionSocket, res))
                    return;
                const { url, includeInteractive } = req.body;
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
                extensionSocket.send(JSON.stringify({
                    type: "snapshot",
                    url,
                    includeInteractive: includeInteractive ?? true,
                    requestId,
                }));
            },
        },
    ];
}
