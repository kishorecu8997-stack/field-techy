import { useState } from "react";
import { Controller, useFormContext, type RegisterOptions } from "react-hook-form";
import { IoIosEyeOff, IoMdEye } from "react-icons/io";

interface ConfirmPasswordInputProps {
  name: string;
  passwordField: string;
  label?: string;
  placeholder?: string;
  required?: boolean | string;
  rules?: RegisterOptions;
  isShowLabel?:boolean;
}

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
  isShowLabel=true,
}: ConfirmPasswordInputProps) => {
  const { control, watch } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const passwordValue = watch(passwordField);

  // Handle required message
  let requiredMessage: string | false = false;
  if (typeof required === "string") {
    requiredMessage = required;
  } else if (required === true) {
    requiredMessage = `${label || name} is required`;
  }

  // Build validate function(s)
  const baseValidate = (value: string) =>
    value === passwordValue || "Passwords do not match";

  const finalRules: RegisterOptions = {
    required: requiredMessage,
    ...rules,
  };

  // If user provided validate, merge it with our match validation
  if (rules?.validate) {
    const userValidate = rules.validate;

    finalRules.validate = {
      matchesPassword: baseValidate,
      ...(typeof userValidate === "function"
        ? { custom: userValidate }
        : userValidate),
    };
  } else {
    finalRules.validate = baseValidate;
  }

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
        rules={finalRules}
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