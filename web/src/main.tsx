import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import App from "./app/App.tsx";
import "./index.css";
import { GlobalPopup } from "./shared/components/popup/GlobalPopup.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <GlobalPopup />
    <ToastContainer />
    <App />
  </>
);
