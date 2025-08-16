import { z } from "zod";
import { makeExtensionRequest } from "../utils/helpers.js";

export const consoleLogsToolSchema = {
  tabId: z.number().optional(),
  levels: z
    .array(z.enum(["log", "info", "warn", "error", "debug"]))
    .optional()
    .default(["log", "info", "warn", "error"]),
  since: z.number().optional(),
  limit: z.number().optional().default(100),
};

export async function getConsoleLogs({
  tabId,
  levels,
  since,
  limit,
}: {
  tabId?: number;
  levels?: ("log" | "info" | "warn" | "error" | "debug")[];
  since?: number;
  limit?: number;
}) {
  return await makeExtensionRequest("console-logs", {
    tabId,
    levels: levels ?? ["log", "info", "warn", "error"],
    since,
    limit: limit ?? 100,
  });
}

export const consoleLogsToolDef = {
  name: "console-logs",
  description:
    "Get console logs from the current tab. Optionally filter by levels and time range.",
  schema: consoleLogsToolSchema,
  handler: getConsoleLogs,
};
