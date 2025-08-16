import { z } from "zod";
export declare const clickToolSchema: {
    selector: z.ZodString;
    tabId: z.ZodOptional<z.ZodNumber>;
    timeoutMs: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
};
export declare const hoverToolSchema: {
    selector: z.ZodString;
    tabId: z.ZodOptional<z.ZodNumber>;
    timeoutMs: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
};
export declare function clickElement({ selector, tabId, timeoutMs, }: {
    selector: string;
    tabId?: number;
    timeoutMs?: number;
}): Promise<any>;
export declare function hoverElement({ selector, tabId, timeoutMs, }: {
    selector: string;
    tabId?: number;
    timeoutMs?: number;
}): Promise<any>;
export declare const clickToolDef: {
    name: string;
    description: string;
    schema: {
        selector: z.ZodString;
        tabId: z.ZodOptional<z.ZodNumber>;
        timeoutMs: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    };
    handler: typeof clickElement;
};
export declare const hoverToolDef: {
    name: string;
    description: string;
    schema: {
        selector: z.ZodString;
        tabId: z.ZodOptional<z.ZodNumber>;
        timeoutMs: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    };
    handler: typeof hoverElement;
};
//# sourceMappingURL=interaction.d.ts.map