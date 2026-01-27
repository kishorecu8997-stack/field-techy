import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import App from "./app/App.tsx";
import "./index.css";
import { GlobalPopup } from "./shared/components/popup/GlobalPopup.tsx";
import "./shared/apiServices/utils/errorHandlerConfig";
import { useThemeHook } from "./shared/hooks/useThemeHook.ts";

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
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // Replaces cacheTime
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
  },
});

const rootElement = document.getElementById("root")!;
const ToastHandler = () => {
  const isDark = useThemeHook();
  return <ToastContainer theme={isDark ? "dark" : "light"} />;
};

// Prevent multiple createRoot calls during hot module reloading
let root = (window as any).__react_root__;
if (!root) {
  root = createRoot(rootElement);
  (window as any).__react_root__ = root;
}

import { ToastProvider } from "./shared/components/commonUI/toastContext.tsx";

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <GlobalPopup />
        <ToastHandler />
        <App />
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
