import { z } from "zod";
import { makeExtensionRequest } from "../utils/helpers.js";
export const backToolSchema = {
    tabId: z.number().optional(),
};
export const forwardToolSchema = {
    tabId: z.number().optional(),
};
export async function goBack({ tabId }) {
    return await makeExtensionRequest("tab-back", { tabId });
}
export async function goForward({ tabId }) {
    return await makeExtensionRequest("tab-forward", { tabId });
}
export const backToolDef = {
    name: "tab-back",
    description: "Go back in the active tab's history. Optionally pass tabId.",
    schema: backToolSchema,
    handler: goBack,
};
export const forwardToolDef = {
    name: "tab-forward",
    description: "Go forward in the active tab's history. Optionally pass tabId.",
    schema: forwardToolSchema,
    handler: goForward,
};
