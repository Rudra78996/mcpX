import { z } from "zod";
export declare const waitToolSchema: {
    type: z.ZodEnum<["time", "element", "navigation"]>;
    value: z.ZodAny;
    timeout: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    tabId: z.ZodOptional<z.ZodNumber>;
};
export declare function wait({ type, value, timeout, tabId, }: {
    type: "time" | "element" | "navigation";
    value: any;
    timeout?: number;
    tabId?: number;
}): Promise<any>;
export declare const waitToolDef: {
    name: string;
    description: string;
    schema: {
        type: z.ZodEnum<["time", "element", "navigation"]>;
        value: z.ZodAny;
        timeout: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        tabId: z.ZodOptional<z.ZodNumber>;
    };
    handler: typeof wait;
};
//# sourceMappingURL=wait.d.ts.map