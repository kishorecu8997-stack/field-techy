/// <reference types="vite/client" />

declare module "virtual:pwa-register" {
  export function registerSW(options?: {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
  }): () => void;
}

// --- Add global window type for React root ---
import type { Root } from "react-dom/client";

declare global {
  interface Window {
    __react_root__?: Root;
  }
}

