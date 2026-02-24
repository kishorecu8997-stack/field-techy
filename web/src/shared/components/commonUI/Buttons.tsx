import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../libs/utils";
import Loader2 from "../Loader2";
import { scrollToTop } from "@/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"
    | "outline"
    | "link"
    | "text"
    | "solid"
    | "liveChat"
    | "closeChat"
    | "liveChatSend"
    | "no_style"
    | "dropdown"
    | "warning"
    | "headerClose"
    | "videoCall"
    | "audioCall"
    | "attachmentPlus"
    | "photoVideoAttachment"
    | "documentAttachment"
    | "sendButtonChat"
    | "chats"
    | "close"
    | "callLogs"
    | "rejectCall"
    | "acceptCall"
    | "cancel"
    | "accept";
  size?: "sm" | "md" | "lg" | "icon" | "chip";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isScrollToTop?: boolean;
}

/**
 * Button - A reusable button component for React.
 *
 * Features:
 * - Supports primary, secondary, ghost, danger, outline, link, and solid variants.
 * - Supports small, medium, large, and icon sizes.
 * - Supports loading state.
 * - Supports left and right icons.
 * - Supports custom class names.
 * - Supports full width.
 * - Supports scroll to top on click.
 */

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  type = "button",
  isScrollToTop = false,
  onClick,
  ...rest
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variantStyles: Record<string, string> = {
    primary:
      "bg-emerald-600 hover:bg-emerald-700 font-semibold text-white focus:ring-emerald-500",
    secondary:
      "bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-500 focus:ring-gray-300 dark:focus:ring-gray-400",
    ghost:
      "bg-transparent hover:bg-gray-100 text-gray-800 focus:ring-gray-300 dark:text-white dark:hover:bg-zinc-800",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline:
      "border border-gray-300 text-gray-800 hover:bg-gray-100 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    link: "bg-transparent underline-offset-4 hover:underline text-emerald-600 hover:text-emerald-700 ",
    solid:
      "bg-[#0f1727] dark:border dark:border-gray-500 text-white hover:bg-[#1e293b] focus:ring-2 focus:ring-[#334155] focus:outline-none",
    liveChat: "bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500",
    liveChatSend:
      "bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500",
    closeChat:
      "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center p-1 h-8 w-8",
    headerClose: "text-gray-500 hover:text-gray-700",
    no_style: "focus:ring-0 focus:ring-offset-0 focus:outline-none",
    dropdown:
      "flex items-center justify-between h-[48px] px-3 py-1 border-r border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",
    warning:
      " bg-yellow-200 text-black border border-gray-500 hover:bg-yellow-300 focus:ring-gray-100",
    videoCall:
      "rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-green-600 text-teal-700 hover:text-teal-600 transition flex items-center justify-center",
    audioCall:
      "rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-green-600 text-teal-700 hover:text-teal-600 transition flex items-center justify-center",
    attachmentPlus:
      "rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 cursor-pointer",
    photoVideoAttachment:
      "flex items-center gap-2 rounded dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer",
    documentAttachment:
      "flex items-center gap-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer",
    sendButtonChat:
      "rounded-full bg-teal-700 text-white hover:bg-teal-600 cursor-pointer",
      chats:
      "bg-teal-700 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 text-white cursor-pointer hover:bg-teal-600 transition-colors",
      close:
      "p-1 text-gray-500 hover:text-gray-700 transition-colors",
      callLogs:
      "py-2 px-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center",
      rejectCall:
      "bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-sm flex items-center gap-2",
      acceptCall:
      "bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-lg shadow-sm flex items-center gap-2",
      cancel:
      "px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium",
      accept:
      "px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium"
  };

  const sizeStyles: Record<string, string> = {
    sm: "h-11 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-11 w-11",
    chip: "h-9 px-3 py-1.5 text-sm",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isScrollToTop) scrollToTop();
    if (onClick) onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      type={type}
      className={cn(
        baseStyles,
        variantStyles[variant],
        variant !== "dropdown" && !["callLogs", "rejectCall", "acceptCall", "cancel", "accept", "close"].includes(variant) && sizeStyles[size],
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}

      {children && <span>{children}</span>}

      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
