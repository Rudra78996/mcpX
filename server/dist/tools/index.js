// Navigation tools
export { navigationToolDef } from "./navigation.js";
// History tools
export { backToolDef, forwardToolDef } from "./history.js";
// Wait tool
export { waitToolDef } from "./wait.js";
// Keyboard tools
export { keyPressToolDef } from "./keyboard.js";
// Snapshot tool
export { snapshotToolDef } from "./snapshot.js";
// Interaction tools
export { clickToolDef, hoverToolDef } from "./interaction.js";
// Text input tools
export { typeTextToolDef } from "./text-input.js";
// Console tools
export { consoleLogsToolDef } from "./console.js";
// Screenshot tools
export { screenshotToolDef } from "./screenshot.js";
// Scroll tools
export { scrollToolDef } from "./scroll.js";
// Import all tool definitions for the array
import { navigationToolDef } from "./navigation.js";
import { backToolDef, forwardToolDef } from "./history.js";
import { waitToolDef } from "./wait.js";
import { keyPressToolDef } from "./keyboard.js";
import { snapshotToolDef } from "./snapshot.js";
import { clickToolDef, hoverToolDef } from "./interaction.js";
import { typeTextToolDef } from "./text-input.js";
import { consoleLogsToolDef } from "./console.js";
import { screenshotToolDef } from "./screenshot.js";
import { scrollToolDef } from "./scroll.js";
// Tool definitions array for easy registration
export const allToolDefs = [
    // Navigation
    navigationToolDef,
    // History
    backToolDef,
    forwardToolDef,
    // Wait
    waitToolDef,
    // Keyboard
    keyPressToolDef,
    // Snapshot
    snapshotToolDef,
    // Interaction
    clickToolDef,
    hoverToolDef,
    // Text input
    typeTextToolDef,
    // Console
    consoleLogsToolDef,
    // Screenshot
    screenshotToolDef,
    // Scroll
    scrollToolDef,
];
