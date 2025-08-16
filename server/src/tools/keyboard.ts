import { z } from "zod";
import { makeExtensionRequest, createErrorResponse } from "../utils/helpers.js";

export const keyPressToolSchema = {
  key: z.string().min(1),
  ctrl: z.boolean().optional().default(false),
  alt: z.boolean().optional().default(false),
  shift: z.boolean().optional().default(false),
  meta: z.boolean().optional().default(false),
  tabId: z.number().optional(),
};

export async function pressKey({
  key,
  ctrl,
  alt,
  shift,
  meta,
  tabId,
}: {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  tabId?: number;
}) {
  if (!key || key.trim().length === 0) {
    return createErrorResponse("Key parameter cannot be empty");
  }

  const modifiers = {
    ctrl: ctrl ?? false,
    alt: alt ?? false,
    shift: shift ?? false,
    meta: meta ?? false,
  };

  return await makeExtensionRequest("press-key", {
    key: key.trim(),
    modifiers,
    tabId,
  });
}

export const keyPressToolDef = {
  name: "press-key",
  description:
    "Press a key or key combination on the keyboard. Supports modifiers: ctrl, alt, shift, meta",
  schema: keyPressToolSchema,
  handler: pressKey,
};
