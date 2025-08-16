import { z } from "zod";
export declare const typeTextToolSchema: {
    text: z.ZodString;
    selector: z.ZodOptional<z.ZodString>;
    delay: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    tabId: z.ZodOptional<z.ZodNumber>;
};
export declare function typeText({ text, selector, delay, tabId, }: {
    text: string;
    selector?: string;
    delay?: number;
    tabId?: number;
}): Promise<any>;
export declare const typeTextToolDef: {
    name: string;
    description: string;
    schema: {
        text: z.ZodString;
        selector: z.ZodOptional<z.ZodString>;
        delay: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        tabId: z.ZodOptional<z.ZodNumber>;
    };
    handler: typeof typeText;
};
//# sourceMappingURL=text-input.d.ts.map