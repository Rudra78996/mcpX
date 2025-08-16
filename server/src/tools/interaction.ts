import { z } from "zod";
import {
  makeExtensionRequest,
  sanitizeSelector,
  createErrorResponse,
} from "../utils/helpers.js";

export const clickToolSchema = {
  selector: z.string().min(1),
  tabId: z.number().optional(),
  timeoutMs: z.number().optional().default(5000),
};

export const hoverToolSchema = {
  selector: z.string().min(1),
  tabId: z.number().optional(),
  timeoutMs: z.number().optional().default(5000),
};

export async function clickElement({
  selector,
  tabId,
  timeoutMs,
}: {
  selector: string;
  tabId?: number;
  timeoutMs?: number;
}) {
  if (!selector || selector.trim().length === 0) {
    return createErrorResponse("Selector parameter cannot be empty");
  }

  const sanitizedSelector = sanitizeSelector(selector);

  return await makeExtensionRequest("tab-click", {
    selector: sanitizedSelector,
    tabId,
    timeoutMs: timeoutMs ?? 5000,
  });
}

export async function hoverElement({
  selector,
  tabId,
  timeoutMs,
}: {
  selector: string;
  tabId?: number;
  timeoutMs?: number;
}) {
  if (!selector || selector.trim().length === 0) {
    return createErrorResponse("Selector parameter cannot be empty");
  }

  const sanitizedSelector = sanitizeSelector(selector);

  return await makeExtensionRequest("hover", {
    selector: sanitizedSelector,
    tabId,
    timeoutMs: timeoutMs ?? 5000,
  });
}

export const clickToolDef = {
  name: "tab-click",
  description:
    "Click an element in the current tab by CSS selector. Optionally pass tabId.",
  schema: clickToolSchema,
  handler: clickElement,
};

export const hoverToolDef = {
  name: "hover",
  description:
    "Hover over an element in the current tab by CSS selector. Optionally pass tabId.",
  schema: hoverToolSchema,
  handler: hoverElement,
};
