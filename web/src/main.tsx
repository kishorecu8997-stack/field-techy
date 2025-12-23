import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import App from "./app/App.tsx";
import "./index.css";
import { GlobalPopup } from "./shared/components/popup/GlobalPopup.tsx";
import React from "react";
 
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalPopup />
    <ToastContainer />
    <App />
  </React.StrictMode>
);
 