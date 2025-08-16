export async function postJson(url, body, timeoutMs = 10000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: controller.signal,
        });
        const text = await res.text();
        try {
            return JSON.parse(text);
        }
        catch {
            return { status: res.status, text };
        }
    }
    finally {
        clearTimeout(timeout);
    }
}
export function createToolResponse(content, isError = false) {
    return {
        content: [
            {
                type: "text",
                text: isError ? content : JSON.stringify(content),
            },
        ],
    };
}
export function createErrorResponse(message, error) {
    const errorMessage = error?.message || error || message;
    return createToolResponse(`Error: ${errorMessage}`, true);
}
export async function makeExtensionRequest(endpoint, payload, baseUrl = "http://localhost:3000") {
    try {
        const data = await postJson(`${baseUrl}/${endpoint}`, payload);
        return createToolResponse(data);
    }
    catch (err) {
        return createErrorResponse(`${endpoint} error`, err);
    }
}
export function validateUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
export function sanitizeSelector(selector) {
    // Basic sanitization for CSS selectors
    return selector.trim().replace(/[<>]/g, "");
}
export function generateRequestId() {
    return Math.random().toString(36).substring(2, 15);
}
