import { z } from "zod";
import {
  makeExtensionRequest,
  sanitizeSelector,
  createErrorResponse,
} from "../utils/helpers.js";

export const typeTextToolSchema = {
  text: z.string(),
  selector: z.string().optional(),
  delay: z.number().optional().default(50),
  tabId: z.number().optional(),
};

export async function typeText({
  text,
  selector,
  delay,
  tabId,
}: {
  text: string;
  selector?: string;
  delay?: number;
  tabId?: number;
}) {
  if (typeof text !== "string") {
    return createErrorResponse("Text parameter must be a string");
  }

  let sanitizedSelector: string | undefined;
  if (selector) {
    if (selector.trim().length === 0) {
      return createErrorResponse(
        "Selector parameter cannot be empty if provided"
      );
    }
    sanitizedSelector = sanitizeSelector(selector);
  }

  return await makeExtensionRequest("type-text", {
    text,
    selector: sanitizedSelector,
    delay: delay ?? 50,
    tabId,
  });
}

export const typeTextToolDef = {
  name: "type-text",
  description:
    "Type text into an element or the active element. Optionally specify a CSS selector to target a specific element.",
  schema: typeTextToolSchema,
  handler: typeText,
};
