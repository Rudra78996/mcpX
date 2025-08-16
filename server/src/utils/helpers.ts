import { ExtensionRequest, ExtensionResponse } from "../types/index.js";

export async function postJson(
  url: string,
  body: any,
  timeoutMs = 10000
): Promise<any> {
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
    } catch {
      return { status: res.status, text };
    }
  } finally {
    clearTimeout(timeout);
  }
}

export function createToolResponse(content: any, isError = false) {
  return {
    content: [
      {
        type: "text",
        text: isError ? content : JSON.stringify(content),
      },
    ],
  };
}

export function createErrorResponse(message: string, error?: any): any {
  const errorMessage = error?.message || error || message;
  return createToolResponse(`Error: ${errorMessage}`, true);
}

export async function makeExtensionRequest(
  endpoint: string,
  payload: any,
  baseUrl = "http://localhost:3000"
): Promise<any> {
  try {
    const data = await postJson(`${baseUrl}/${endpoint}`, payload);
    return createToolResponse(data);
  } catch (err: any) {
    return createErrorResponse(`${endpoint} error`, err);
  }
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeSelector(selector: string): string {
  // Basic sanitization for CSS selectors
  return selector.trim().replace(/[<>]/g, "");
}

export function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15);
}
