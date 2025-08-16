import { z } from "zod";
export declare const consoleLogsToolSchema: {
    tabId: z.ZodOptional<z.ZodNumber>;
    levels: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEnum<["log", "info", "warn", "error", "debug"]>, "many">>>;
    since: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
};
export declare function getConsoleLogs({ tabId, levels, since, limit, }: {
    tabId?: number;
    levels?: ("log" | "info" | "warn" | "error" | "debug")[];
    since?: number;
    limit?: number;
}): Promise<any>;
export declare const consoleLogsToolDef: {
    name: string;
    description: string;
    schema: {
        tabId: z.ZodOptional<z.ZodNumber>;
        levels: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEnum<["log", "info", "warn", "error", "debug"]>, "many">>>;
        since: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    };
    handler: typeof getConsoleLogs;
};
//# sourceMappingURL=console.d.ts.map