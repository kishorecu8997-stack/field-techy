import { Controller, useFormContext, type RegisterOptions } from "react-hook-form";
import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options: SelectOption[];
  /** Additional react-hook-form validation rules */
  rules?: RegisterOptions;
  /** Custom className for the select container */
  containerClassName?: string;
  /** Custom className for the select element */
  selectClassName?: string;
}

/**
 * SelectField - A reusable select dropdown component for react-hook-form.
 *
 * Integrates with react-hook-form using Controller.
 * Shows a * if required.
 * Supports custom styling and validation.
 */
export const SelectField = ({
  name,
  label,
  placeholder,
  required = false,
  options,
  rules,
  containerClassName = "flex flex-col py-1 w-full",
  selectClassName = "w-full rounded-md border border-gray-300 dark:border-gray-600 py-3 px-5 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 appearance-none",
}: SelectFieldProps) => {
  const { control } = useFormContext();

  // Default validation rules
  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    ...rules,
  };

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field, fieldState: { error } }) => (
          <>
            <select
              {...field}
              id={name}
              className={selectClassName}
            >
              {placeholder && (
                <option value="" disabled hidden>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                {error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};