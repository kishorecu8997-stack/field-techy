import { ToastProvider } from "./shared/components/commonUI/toastContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./index.css";
import { GlobalPopup } from "./shared/components/popup/GlobalPopup.tsx";
import "./shared/apiServices/utils/errorHandlerConfig";
import { ToastHandler } from "./shared/components/commonUI/ToastHandler.tsx";
import { FCMHandler } from "./shared/components/FCMHandler.tsx";

// Stripe is initialized lazily in AddFundModal to avoid loading Stripe SDK on every page

/**
 * Creates a configured QueryClient instance with default query behaviors.
 *
 * - `staleTime`: How long fetched data is considered fresh (5 minutes).
 * - `gcTime`: How long unused cache stays in memory before garbage collection (30 minutes).
 * - `retry`: Number of retry attempts for failed queries (2 times).
 * - `refetchOnWindowFocus`: Prevents automatic refetching when the browser window regains focus.
 * - `refetchOnReconnect`: Automatically refetches when the network reconnects.
 * - `refetchOnMount`: Disables refetching when a component mounts if data is fresh.
 *
 * This configuration improves performance, reduces unnecessary API calls,
 * and provides consistent error-handling and caching behavior across the app.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Always consider data stale so it refetches immediately
      gcTime: 30 * 60 * 1000, // Replaces cacheTime
      retry: 2,
      refetchOnWindowFocus: true, // Automatically refetch when the browser window regains focus
      refetchOnReconnect: true,
      refetchOnMount: true, // Always fetch when a screen component mounts
    },
  },
});

const rootElement = document.getElementById("root")!;

// Prevent multiple createRoot calls during hot module reloading
let root = window.__react_root__;
if (!root) {
  root = createRoot(rootElement);
  window.__react_root__ = root;
}

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <GlobalPopup />
        <ToastHandler />
        <FCMHandler />
        <App />
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
