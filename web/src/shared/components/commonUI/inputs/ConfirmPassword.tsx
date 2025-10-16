import { useState } from "react";
import { Controller, useFormContext, type RegisterOptions } from "react-hook-form";
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import type { ConfirmPasswordInputProps } from "./type";



/**
 * ConfirmPasswordInput - A reusable confirm password input component for react-hook-form.
 *
 * Features:
 * - Show/hide password toggle button.
 * - Validates that the value matches the original password field.
 * - Supports light and dark theme styling via Tailwind CSS.
 * - Integrated with react-hook-form using Controller.
 * - Supports required and custom validation rules.
 */
export const ConfirmPassword = ({
  name,
  passwordField,
  label,
  placeholder,
  required = false,
  rules,
}: ConfirmPasswordInputProps) => {
  const { control, watch } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const passwordValue = watch(passwordField); // get the original password value

  // Merge default rules (required + match password) with custom rules
  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    validate: (value: string) =>
      value === passwordValue || "Passwords do not match",
    ...rules,
  };

  return (
    <div className="flex flex-col py-1">
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
            <div className="relative">
              <input
                {...field}
                id={name}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder || label}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-3 px-5 pr-12 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                {showPassword ? (
                  <IoIosEyeOff className="text-xl h-6 w-6" />
                ) : (
                  <IoMdEye className="text-xl h-6 w-6" />
                )}
              </button>
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