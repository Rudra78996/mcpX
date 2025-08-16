export interface ExtensionRequest {
  type: string;
  requestId: string;
  [key: string]: any;
}

export interface ExtensionResponse {
  type: string;
  requestId: string;
  success: boolean;
  result?: any;
  error?: string;
  [key: string]: any;
}

export interface TabInfo {
  id: number;
  url?: string;
  title?: string;
  active?: boolean;
}

export interface SnapshotResult {
  url: string;
  title: string;
  dom: string;
  timestamp: number;
  interactiveElements?: InteractiveElement[];
}

export interface InteractiveElement {
  selector: string;
  tag: string;
  text?: string;
  role?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  coordinates: {
    x: number;
    y: number;
  };
}

export interface KeyPressOptions {
  key: string;
  modifiers?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
  };
  tabId?: number;
}

export interface WaitOptions {
  type: "time" | "element" | "navigation";
  value: number | string;
  timeout?: number;
  tabId?: number;
}

export interface TypeTextOptions {
  text: string;
  selector?: string;
  delay?: number;
  tabId?: number;
}

export interface HoverOptions {
  selector: string;
  tabId?: number;
}

export interface ScreenshotOptions {
  format?: "png" | "jpeg";
  quality?: number;
  fullPage?: boolean;
  tabId?: number;
}

export interface ConsoleLogEntry {
  level: "log" | "info" | "warn" | "error" | "debug";
  message: string;
  timestamp: number;
  source?: string;
}
