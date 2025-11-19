import React from "react";

interface InputOutlineProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder: string;
  className?: string;
}

/**
 * Renders a styled input element with an outline.
 *
 * This component provides a consistent look and feel for text inputs
 * across the application. It can be customized with additional class names
 * and accepts all standard HTML input attributes. Note: The `label` prop
 * is available but not currently rendered.
 *
 * @param {InputOutlineProps} props - The properties for the input component.
 * @returns {JSX.Element} The rendered input element.
 */
export function InputOutline({
  placeholder,
  className = "",
  ...props
}: InputOutlineProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`w-32 px-3 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 dark:text-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-graring-gray-200 ${className}`}
      {...props}
    />
  );
}
