import { z } from "zod";
export declare const navigateToolSchema: {
    url: z.ZodString;
    active: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
};
export declare function navigateToUrl({ url, active, }: {
    url: string;
    active?: boolean;
}): Promise<any>;
export declare const navigationToolDef: {
    name: string;
    description: string;
    schema: {
        url: z.ZodString;
        active: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    };
    handler: typeof navigateToUrl;
};
//# sourceMappingURL=navigation.d.ts.map