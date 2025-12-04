import React from "react";

interface InputOutlineProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder: string;
  className?: string;
  onlyNumbers?: boolean;
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
  onlyNumbers = false,
  onChange,
  ...props
}: InputOutlineProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
  };

  // Prevent typing invalid characters
  const handleBeforeInput = (e: React.FormEvent<HTMLInputElement> & { data?: string }) => {
    if (!onlyNumbers) return;

    const input = e.currentTarget;
    const char = e.data;
    if (!char) return;

    // Allow digits, dot, and $ only at start
    if (!/[0-9.]|\$/.test(char)) {
      e.preventDefault();
      return;
    }

    // Only one dot allowed
    if (char === "." && input.value.includes(".")) {
      e.preventDefault();
    }

    // $ only allowed at start
    if (char === "$" && input.selectionStart !== 0) {
      e.preventDefault();
    }

    // Only one $ allowed
    if (char === "$" && input.value.includes("$")) {
      e.preventDefault();
    }
  };

  // Prevent pasting invalid characters
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (!onlyNumbers) return;

    const pasted = e.clipboardData.getData("Text");

    // Only allow $ at start, numbers, and at most one decimal
    if (!/^\$?\d*\.?\d*$/.test(pasted)) {
      e.preventDefault();
    }
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`w-32 px-3 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 dark:text-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200 ${className}`}
      onChange={handleChange}
      onBeforeInput={handleBeforeInput}
      onPaste={handlePaste}
      {...props}
    />
  );
}