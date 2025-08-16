import { z } from "zod";
import { makeExtensionRequest, createErrorResponse } from "../utils/helpers.js";
export const waitToolSchema = {
    type: z.enum(["time", "element", "navigation"]),
    value: z.union([z.number(), z.string()]),
    timeout: z.number().optional().default(30000),
    tabId: z.number().optional(),
};
export async function wait({ type, value, timeout, tabId, }) {
    if (type === "time" && typeof value !== "number") {
        return createErrorResponse("For time-based waits, value must be a number (milliseconds)");
    }
    if ((type === "element" || type === "navigation") &&
        typeof value !== "string") {
        return createErrorResponse("For element or navigation waits, value must be a string");
    }
    return await makeExtensionRequest("wait", {
        type,
        value,
        timeout: timeout ?? 30000,
        tabId,
    });
}
export const waitToolDef = {
    name: "wait",
    description: "Wait for a specified condition. Types: 'time' (milliseconds), 'element' (CSS selector), 'navigation' (URL pattern)",
    schema: waitToolSchema,
    handler: wait,
};
