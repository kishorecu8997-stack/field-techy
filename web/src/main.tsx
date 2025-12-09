import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import App from "./app/App.tsx";
import "./index.css";
import { GlobalPopup } from "./shared/components/popup/GlobalPopup.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <GlobalPopup />
    <ToastContainer />
    <App />
  </QueryClientProvider>
);
