import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import App from "./app/App.tsx";
import "./index.css";
import { GlobalPopup } from "./shared/components/popup/GlobalPopup.tsx";
import React from "react";
import { useJobExpirationNotification } from "@/hooks/useJobExpirationNotifications";

const RootWrapper = () => {
  useJobExpirationNotification();

  return (
    <React.StrictMode>
      <GlobalPopup />
      <ToastContainer />
      <App />
    </React.StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<RootWrapper />);
