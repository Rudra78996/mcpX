import { z } from "zod";
import { makeExtensionRequest, createErrorResponse } from "../utils/helpers.js";
export const waitToolSchema = {
    type: z.enum(["time", "element", "navigation"]),
    value: z
        .any()
        .describe("For type 'time': number (milliseconds), for 'element'/'navigation': string (selector/URL pattern)"),
    timeout: z.number().optional().default(30000),
    tabId: z.number().optional(),
};
export async function wait({ type, value, timeout, tabId, }) {
    // Comprehensive validation for type-specific value requirements
    console.log("Wait tool called with:", { type, value, timeout, tabId });
    console.log("Value type:", typeof value);
    if (type === "time") {
        if (typeof value !== "number") {
            const errorMsg = `For time-based waits, value must be a number (milliseconds). Got ${typeof value}: ${JSON.stringify(value)}`;
            console.error("Wait validation error:", errorMsg);
            return createErrorResponse(errorMsg);
        }
        if (value < 0) {
            const errorMsg = `Time value must be non-negative. Got: ${value}`;
            console.error("Wait validation error:", errorMsg);
            return createErrorResponse(errorMsg);
        }
    }
    if (type === "element" || type === "navigation") {
        if (typeof value !== "string") {
            const errorMsg = `For ${type} waits, value must be a string. Got ${typeof value}: ${JSON.stringify(value)}`;
            console.error("Wait validation error:", errorMsg);
            return createErrorResponse(errorMsg);
        }
        if (value.trim().length === 0) {
            const errorMsg = type === "element"
                ? "Element selector cannot be empty"
                : "Navigation URL pattern cannot be empty";
            console.error("Wait validation error:", errorMsg);
            return createErrorResponse(errorMsg);
        }
    }
    console.log("Wait validation passed, making extension request");
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
