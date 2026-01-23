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
    | "no_style"
    | "dropdown"
  ;

  size?: "sm" | "md" | "lg" | "icon";
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
      "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300",
    ghost:
      "bg-transparent hover:bg-gray-100 text-gray-800 focus:ring-gray-300 dark:text-white dark:hover:bg-zinc-800",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline:
      "border border-gray-300 text-gray-800 hover:bg-gray-100 focus:ring-gray-300 dark:text-white dark:hover:bg-zinc-800",
    link: "bg-transparent underline-offset-4 hover:underline text-emerald-600 hover:text-emerald-700 ",
    solid:
      "bg-[#0f1727] dark:border dark:border-gray-500 text-white hover:bg-[#1e293b] focus:ring-2 focus:ring-[#334155] focus:outline-none",
    no_style: "",
    dropdown:
      "flex items-center justify-between h-[48px] px-3 py-1 border-r border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed",
  };

  const sizeStyles: Record<string, string> = {
    sm: "h-11 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-11 w-11",
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
        variant !== "dropdown" && sizeStyles[size],
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
