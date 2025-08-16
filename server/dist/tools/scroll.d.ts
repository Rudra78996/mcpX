import { z } from "zod";
export declare const scrollToolSchema: {
    direction: z.ZodEnum<["up", "down", "left", "right", "top", "bottom"]>;
    distance: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    tabId: z.ZodOptional<z.ZodNumber>;
    selector: z.ZodOptional<z.ZodString>;
    timeoutMs: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
};
export declare function scrollPage({ direction, distance, tabId, selector, timeoutMs, }: {
    direction: "up" | "down" | "left" | "right" | "top" | "bottom";
    distance?: number;
    tabId?: number;
    selector?: string;
    timeoutMs?: number;
}): Promise<any>;
export declare const scrollToolDef: {
    name: string;
    description: string;
    schema: {
        direction: z.ZodEnum<["up", "down", "left", "right", "top", "bottom"]>;
        distance: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        tabId: z.ZodOptional<z.ZodNumber>;
        selector: z.ZodOptional<z.ZodString>;
        timeoutMs: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    };
    handler: typeof scrollPage;
};
//# sourceMappingURL=scroll.d.ts.map