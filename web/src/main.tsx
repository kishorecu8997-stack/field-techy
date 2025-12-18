import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import App from "./app/App.tsx";
import "./index.css";
import { GlobalPopup } from "./shared/components/popup/GlobalPopup.tsx";
import React from "react";
import { registerSW } from 'virtual:pwa-register'

registerSW({
  onOfflineReady() {
    console.log('App is ready to work offline')
  },
})

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalPopup />
    <ToastContainer />
    <App />
  </React.StrictMode>
);
