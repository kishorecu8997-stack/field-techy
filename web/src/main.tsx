import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { ToastContainer } from 'react-toastify';
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
     <ToastContainer />
      <App />    
  </StrictMode>
);
