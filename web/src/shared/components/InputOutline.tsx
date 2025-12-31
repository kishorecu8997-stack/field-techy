import React from "react";

interface InputOutlineProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder: string;
  className?: string;
  id?: string;
  error?: string;
}

/**
 * Renders a styled input element with an outline.
 *
 * This component provides a consistent look and feel for text inputs
 * across the application. It can be customized with additional class names
 * and accepts all standard HTML input attributes.
 *
 * @param {InputOutlineProps} props - The properties for the input component.
 * @returns {JSX.Element} The rendered input element.
 */
export function InputOutline({
  label,
  placeholder,
  className = "",
  id,
  ...props
}: InputOutlineProps) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        placeholder={placeholder}
        className={`w-32 px-3 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 dark:text-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-graring-gray-200 ${className}`}
        {...props}
      />
    </div>
  );
}
