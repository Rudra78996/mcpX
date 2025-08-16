import { Request, Response } from "express";
import { WebSocket } from "ws";
export interface RequestHandler {
    path: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    handler: (req: Request, res: Response) => void;
}
export declare function ensureExtension(extensionSocket: WebSocket | null, res: Response): boolean;
export declare function makeRequest(extensionSocket: WebSocket, type: string, payload: any, expectType: string, res: Response, timeoutMs?: number): void;
//# sourceMappingURL=base.d.ts.map