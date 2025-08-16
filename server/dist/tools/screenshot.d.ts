import { z } from "zod";
export declare const screenshotToolSchema: {
    format: z.ZodDefault<z.ZodOptional<z.ZodEnum<["png", "jpeg"]>>>;
    quality: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    fullPage: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    tabId: z.ZodOptional<z.ZodNumber>;
};
export declare function takeScreenshot({ format, quality, fullPage, tabId, }: {
    format?: "png" | "jpeg";
    quality?: number;
    fullPage?: boolean;
    tabId?: number;
}): Promise<any>;
export declare const screenshotToolDef: {
    name: string;
    description: string;
    schema: {
        format: z.ZodDefault<z.ZodOptional<z.ZodEnum<["png", "jpeg"]>>>;
        quality: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        fullPage: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        tabId: z.ZodOptional<z.ZodNumber>;
    };
    handler: typeof takeScreenshot;
};
//# sourceMappingURL=screenshot.d.ts.map