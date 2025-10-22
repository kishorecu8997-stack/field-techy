import { Controller, useFormContext, type RegisterOptions } from "react-hook-form";
import type { ReactNode } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options?: Option[];
  rules?: RegisterOptions;
  leftIcon?: ReactNode;
}

// Custom chevron-down icon
const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500 pointer-events-none"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export const SelectField = ({
  name,
  label,
  placeholder = "Select",
  required = false,
  options = [],
  rules,
  leftIcon,
}: SelectFieldProps) => {
  const { control } = useFormContext();

  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    ...rules,
  };

  return (
    <div className="flex flex-col py-1">
      {label && (
        <label htmlFor={name} className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field, fieldState: { error } }) => (
          <>
            <div className="relative w-full flex items-center">
              {leftIcon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {leftIcon}
                </div>
              )}

              {/* Select wrapper for custom arrow */}
              <div className="relative w-full">
                <select
                  {...field}
                  id={name}
                  value={field.value ?? ""}
                  className={`w-full rounded-md border border-gray-300 dark:border-gray-600 py-3 px-4 ${
                    leftIcon ? 'pl-10' : ''
                  } pr-10 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary transition appearance-none`}
                >
                  <option value="" disabled>
                    {placeholder}
                  </option>
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* Custom dropdown arrow */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>

            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default SelectField;