import { z } from "zod";
import { makeExtensionRequest, validateUrl } from "../utils/helpers.js";

export const snapshotToolSchema = {
  url: z.string().url(),
  includeInteractive: z.boolean().optional().default(true),
};

export async function takeSnapshot({
  url,
  includeInteractive,
}: {
  url: string;
  includeInteractive?: boolean;
}) {
  if (!validateUrl(url)) {
    return {
      content: [
        {
          type: "text",
          text: "Error: Invalid URL provided",
        },
      ],
    };
  }

  return await makeExtensionRequest("snapshot", {
    url,
    includeInteractive: includeInteractive ?? true,
  });
}

export const snapshotToolDef = {
  name: "snapshot",
  description:
    "Take a DOM snapshot of the current page with optional interactive elements detection",
  schema: snapshotToolSchema,
  handler: takeSnapshot,
};
