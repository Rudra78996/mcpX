import { z } from "zod";
import {
  makeExtensionRequest,
  validateUrl,
  createErrorResponse,
} from "../utils/helpers.js";

export const navigateToolSchema = {
  url: z.string().url(),
  active: z.boolean().optional().default(true),
};

export async function navigateToUrl({
  url,
  active,
}: {
  url: string;
  active?: boolean;
}) {
  if (!validateUrl(url)) {
    return createErrorResponse("Invalid URL provided");
  }

  return await makeExtensionRequest("open-tab", {
    url,
    active: active ?? true,
  });
}

export const navigationToolDef = {
  name: "open-tab",
  description:
    "Open a new browser tab to the given URL. Pass active=true to focus it.",
  schema: navigateToolSchema,
  handler: navigateToUrl,
};
