import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import type { SelectFieldProps } from "./type";

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
  isShowLabel=true,
}: SelectFieldProps) => {
  const { control } = useFormContext();

  // Handle required: boolean → default message, string → custom message
  let requiredMessage: string | false = false;
  if (typeof required === "string") {
    requiredMessage = required;
  } else if (required === true) {
    requiredMessage = `${label || name} is required`;
  }

  const validationRules: RegisterOptions = {
    required: requiredMessage,
    ...rules,
  };

  return (
    <div className="flex flex-col py-1">
      {isShowLabel && (
        <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
          {label} {required !== false && <span className="text-red-600">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field, fieldState: { error } }) => (
          <>
            <div className="relative w-full">
              <select
                {...field}
                // Ensure empty value is truly empty string for placeholder to show
                value={field.value ?? ""}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-3 px-5 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
              >
                {/* Placeholder option */}
                <option value="" disabled hidden>
                  {placeholder}
                </option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Custom dropdown arrow */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDownIcon />
              </div>
            </div>

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

export default SelectField;