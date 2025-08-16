import { z } from "zod";
import { makeExtensionRequest } from "../utils/helpers.js";

export const screenshotToolSchema = {
  format: z.enum(["png", "jpeg"]).optional().default("png"),
  quality: z.number().min(0).max(100).optional().default(90),
  fullPage: z.boolean().optional().default(false),
  tabId: z.number().optional(),
};

export async function takeScreenshot({
  format,
  quality,
  fullPage,
  tabId,
}: {
  format?: "png" | "jpeg";
  quality?: number;
  fullPage?: boolean;
  tabId?: number;
}) {
  return await makeExtensionRequest("screenshot", {
    format: format ?? "png",
    quality: quality ?? 90,
    fullPage: fullPage ?? false,
    tabId,
  });
}

export const screenshotToolDef = {
  name: "screenshot",
  description:
    "Take a screenshot of the current page. Options: format (png/jpeg), quality (0-100), fullPage (boolean).",
  schema: screenshotToolSchema,
  handler: takeScreenshot,
};
