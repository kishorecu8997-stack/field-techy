import { createContext, useContext, useMemo, type ReactNode } from "react";
import { toast as rtToast } from "react-toastify";

type Toast = {
  id: string;
  type: "info" | "success" | "error" | "warning";
  message: string;
};

export type ToastContextValue = {
  toast: (message: string, type?: Toast["type"]) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const value = useMemo(
    () => ({
      toast: (message: string, type: Toast["type"] = "info") => {
        rtToast(message, { type });
      },
      success: (message: string) => {
        rtToast.success(message);
      },
      error: (message: string) => {
        rtToast.error(message);
      },
      info: (message: string) => {
        rtToast.info(message);
      },
      warning: (message: string) => {
        rtToast.warning(message);
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
};

export default ToastContext;
