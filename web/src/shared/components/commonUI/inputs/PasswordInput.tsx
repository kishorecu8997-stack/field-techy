import { useState } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import { IoMdEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import type { PasswordInputProps } from "./type";

/**
 * PasswordInput - A reusable password input component for react-hook-form.
 *
 * Features:
 * - Show/hide password toggle button.
 * - Supports light and dark theme styling via Tailwind CSS.
 * - Integrated with react-hook-form using Controller.
 * - Supports required and custom validation rules.
 */
export const PasswordInput = ({
  name,
  label,
  placeholder,
  required = false,
  isShowLabel = true,
  rules,
  disabled = false,
  containerClassName = "flex flex-col py-1",
  inputClassName = "w-full rounded-md border py-3 px-5 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition",
  leftIcon,
}: PasswordInputProps) => {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  // Build required validation message
  let requiredMessage: string | false = false;
  if (typeof required === "string") {
    requiredMessage = required;
  } else if (required === true) {
    requiredMessage = `${label || name} is required`;
  }

  // Merge with custom rules
  const validationRules: RegisterOptions = {
    required: requiredMessage,
    ...rules,
  };

  return (
    <div className={containerClassName}>
      {isShowLabel && (
        <label
          className={`block mb-1 text-md font-semibold ${
            disabled
              ? "text-gray-400 dark:text-gray-400"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {label}{" "}
          {required !== false && <span className="text-red-600">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        disabled={disabled}
        rules={validationRules}
        render={({ field, fieldState: { error } }) => (
          <>
            <div className="relative">
              {leftIcon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  {leftIcon}
                </div>
              )}
              <input
                {...field}
                id={name}
                disabled={disabled}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder || label}
                autoComplete="new-password"
                className={`${inputClassName} ${leftIcon ? "pl-10" : ""} pr-12
                  ${
                    disabled
                      ? "cursor-not-allowed opacity-60 border-gray-400 dark:border-gray-600 focus:ring-0"
                      : "cursor-text bg-white dark:bg-gray-800"
                  }
                  ${
                    error && !disabled
                      ? "border-red-500 focus:ring-1 focus:ring-red-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary"
                  }
                `}
              />
              <button
                type="button"
                onClick={() => !disabled && setShowPassword(!showPassword)}
                disabled={disabled}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  disabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                }`}
                aria-label={showPassword ? "Hide password" : "Show password"}
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
