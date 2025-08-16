import { z } from "zod";
import { makeExtensionRequest, createErrorResponse } from "../utils/helpers.js";

export const scrollToolSchema = {
  direction: z.enum(["up", "down", "left", "right", "top", "bottom"]),
  distance: z.number().optional().default(300),
  tabId: z.number().optional(),
  selector: z.string().optional(),
  timeoutMs: z.number().optional().default(5000),
};

export async function scrollPage({
  direction,
  distance,
  tabId,
  selector,
  timeoutMs,
}: {
  direction: "up" | "down" | "left" | "right" | "top" | "bottom";
  distance?: number;
  tabId?: number;
  selector?: string;
  timeoutMs?: number;
}) {
  const validDirections = ["up", "down", "left", "right", "top", "bottom"];
  if (!validDirections.includes(direction)) {
    return createErrorResponse(
      `Invalid direction. Must be one of: ${validDirections.join(", ")}`
    );
  }

  if (distance !== undefined && distance < 0) {
    return createErrorResponse("Distance must be a positive number");
  }

  return await makeExtensionRequest("scroll", {
    direction,
    distance: distance ?? 300,
    tabId,
    selector: selector?.trim() || undefined,
    timeoutMs: timeoutMs ?? 5000,
  });
}

export const scrollToolDef = {
  name: "tab-scroll",
  description:
    "Scroll the page or a specific element. Supports directions: up, down, left, right, top (scroll to top), bottom (scroll to bottom). Optionally specify a CSS selector to scroll within a specific element, distance in pixels, and tabId.",
  schema: scrollToolSchema,
  handler: scrollPage,
};
