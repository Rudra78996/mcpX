import { z } from "zod";
export declare const snapshotToolSchema: {
    url: z.ZodString;
    includeInteractive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
};
export declare function takeSnapshot({ url, includeInteractive, }: {
    url: string;
    includeInteractive?: boolean;
}): Promise<any>;
export declare const snapshotToolDef: {
    name: string;
    description: string;
    schema: {
        url: z.ZodString;
        includeInteractive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    };
    handler: typeof takeSnapshot;
};
//# sourceMappingURL=snapshot.d.ts.map