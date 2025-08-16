import { z } from "zod";
export declare const backToolSchema: {
    tabId: z.ZodOptional<z.ZodNumber>;
};
export declare const forwardToolSchema: {
    tabId: z.ZodOptional<z.ZodNumber>;
};
export declare function goBack({ tabId }: {
    tabId?: number;
}): Promise<any>;
export declare function goForward({ tabId }: {
    tabId?: number;
}): Promise<any>;
export declare const backToolDef: {
    name: string;
    description: string;
    schema: {
        tabId: z.ZodOptional<z.ZodNumber>;
    };
    handler: typeof goBack;
};
export declare const forwardToolDef: {
    name: string;
    description: string;
    schema: {
        tabId: z.ZodOptional<z.ZodNumber>;
    };
    handler: typeof goForward;
};
//# sourceMappingURL=history.d.ts.map