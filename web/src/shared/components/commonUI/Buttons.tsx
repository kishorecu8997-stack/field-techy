import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../libs/utils";
import Loader2 from "../Loader2";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline" | "link" | "text" | "solid";
  size?: "sm" | "md" | "lg" | "icon";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/**
 * Button Component
 *
 * A reusable styled button component with support for variants, sizes, icons, and loading state.
 *
 * @param {ButtonProps} props - Props for the button
 * @returns {JSX.Element} The rendered button
 *
 * @example
 * <Button variant="primary" size="md" loading leftIcon={<Icon />}>
 *   Click Me
 * </Button>
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
      "bg-[#0f1727] text-white hover:bg-[#1e293b] focus:ring-2 focus:ring-[#334155] focus:outline-none",
  };

  const sizeStyles: Record<string, string> = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10",
  };

  return (
    <button
      type={type}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
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
