import React from "react";
import { ToastContainer } from "react-toastify";
import { useThemeHook } from "../hooks/useThemeHook.ts";
import "react-toastify/dist/ReactToastify.css";

/**
 * Renders ToastContainer with dark or light theme based on user preference.
 */
const ToastHandler: React.FC = () => {
  const isDark = useThemeHook();
  return <ToastContainer theme={isDark ? "dark" : "light"} />;
};

export default ToastHandler;