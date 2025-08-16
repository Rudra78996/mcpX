import { z } from "zod";
export declare const keyPressToolSchema: {
    key: z.ZodString;
    ctrl: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    alt: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    shift: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    meta: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    tabId: z.ZodOptional<z.ZodNumber>;
};
export declare function pressKey({ key, ctrl, alt, shift, meta, tabId, }: {
    key: string;
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
    tabId?: number;
}): Promise<any>;
export declare const keyPressToolDef: {
    name: string;
    description: string;
    schema: {
        key: z.ZodString;
        ctrl: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        alt: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        shift: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        meta: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        tabId: z.ZodOptional<z.ZodNumber>;
    };
    handler: typeof pressKey;
};
//# sourceMappingURL=keyboard.d.ts.map