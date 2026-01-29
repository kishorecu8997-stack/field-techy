import { ToastContainer } from "react-toastify";
import { useThemeHook } from "../../hooks/useThemeHook";
import type { JSX } from "react";

/**
 * Renders a ToastContainer with theme based on system dark/light mode.
 *
 * @returns {JSX.Element} Toast container component
 */
export const ToastHandler = (): JSX.Element => {
  const isDark = useThemeHook();
  return <ToastContainer theme={isDark ? "dark" : "light"} />;
};
