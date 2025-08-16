export declare function postJson(url: string, body: any, timeoutMs?: number): Promise<any>;
export declare function createToolResponse(content: any, isError?: boolean): {
    content: {
        type: string;
        text: any;
    }[];
};
export declare function createErrorResponse(message: string, error?: any): any;
export declare function makeExtensionRequest(endpoint: string, payload: any, baseUrl?: string): Promise<any>;
export declare function validateUrl(url: string): boolean;
export declare function sanitizeSelector(selector: string): string;
export declare function generateRequestId(): string;
//# sourceMappingURL=helpers.d.ts.map