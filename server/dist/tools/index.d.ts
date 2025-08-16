export { navigationToolDef } from "./navigation.js";
export { backToolDef, forwardToolDef } from "./history.js";
export { waitToolDef } from "./wait.js";
export { keyPressToolDef } from "./keyboard.js";
export { snapshotToolDef } from "./snapshot.js";
export { clickToolDef, hoverToolDef } from "./interaction.js";
export { typeTextToolDef } from "./text-input.js";
export { consoleLogsToolDef } from "./console.js";
export { screenshotToolDef } from "./screenshot.js";
export { scrollToolDef } from "./scroll.js";
export declare const allToolDefs: ({
    name: string;
    description: string;
    schema: {
        url: import("zod").ZodString;
        active: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodBoolean>>;
    };
    handler: typeof import("./navigation.js").navigateToUrl;
} | {
    name: string;
    description: string;
    schema: {
        tabId: import("zod").ZodOptional<import("zod").ZodNumber>;
    };
    handler: typeof import("./history.js").goBack;
} | {
    name: string;
    description: string;
    schema: {
        type: import("zod").ZodEnum<["time", "element", "navigation"]>;
        value: import("zod").ZodUnion<[import("zod").ZodNumber, import("zod").ZodString]>;
        timeout: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodNumber>>;
        tabId: import("zod").ZodOptional<import("zod").ZodNumber>;
    };
    handler: typeof import("./wait.js").wait;
} | {
    name: string;
    description: string;
    schema: {
        key: import("zod").ZodString;
        ctrl: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodBoolean>>;
        alt: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodBoolean>>;
        shift: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodBoolean>>;
        meta: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodBoolean>>;
        tabId: import("zod").ZodOptional<import("zod").ZodNumber>;
    };
    handler: typeof import("./keyboard.js").pressKey;
} | {
    name: string;
    description: string;
    schema: {
        url: import("zod").ZodString;
        includeInteractive: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodBoolean>>;
    };
    handler: typeof import("./snapshot.js").takeSnapshot;
} | {
    name: string;
    description: string;
    schema: {
        selector: import("zod").ZodString;
        tabId: import("zod").ZodOptional<import("zod").ZodNumber>;
        timeoutMs: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodNumber>>;
    };
    handler: typeof import("./interaction.js").clickElement;
} | {
    name: string;
    description: string;
    schema: {
        text: import("zod").ZodString;
        selector: import("zod").ZodOptional<import("zod").ZodString>;
        delay: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodNumber>>;
        tabId: import("zod").ZodOptional<import("zod").ZodNumber>;
    };
    handler: typeof import("./text-input.js").typeText;
} | {
    name: string;
    description: string;
    schema: {
        tabId: import("zod").ZodOptional<import("zod").ZodNumber>;
        levels: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["log", "info", "warn", "error", "debug"]>, "many">>>;
        since: import("zod").ZodOptional<import("zod").ZodNumber>;
        limit: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodNumber>>;
    };
    handler: typeof import("./console.js").getConsoleLogs;
} | {
    name: string;
    description: string;
    schema: {
        format: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodEnum<["png", "jpeg"]>>>;
        quality: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodNumber>>;
        fullPage: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodBoolean>>;
        tabId: import("zod").ZodOptional<import("zod").ZodNumber>;
    };
    handler: typeof import("./screenshot.js").takeScreenshot;
} | {
    name: string;
    description: string;
    schema: {
        direction: import("zod").ZodEnum<["up", "down", "left", "right", "top", "bottom"]>;
        distance: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodNumber>>;
        tabId: import("zod").ZodOptional<import("zod").ZodNumber>;
        selector: import("zod").ZodOptional<import("zod").ZodString>;
        timeoutMs: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodNumber>>;
    };
    handler: typeof import("./scroll.js").scrollPage;
})[];
//# sourceMappingURL=index.d.ts.map