import { useState } from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";

interface InputFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean | string;
  type?: "text" | "email" | "number" | "date";
  isShowLabel?: boolean;
  rules?: RegisterOptions;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  showValidationCheck?: boolean;
  disabled?: boolean;
  // optional prop to enforce alphabet-only rule
  alphabetOnly?: boolean;
}

/**
 * InputField - A reusable input component for react-hook-form.
 *
 * Supports text, email, number, and date types.
 * Integrates with react-hook-form using Controller.
 * Shows a * if required.
 * Supports left icons and custom styling.
 */

export const InputField = ({
  name,
  label,
  placeholder,
  required = false,
  type = "text",
  rules,
  isShowLabel = true,
  leftIcon,
  containerClassName = "flex flex-col py-1 w-full",
  inputClassName =
    "w-full rounded-md border border-gray-300 dark:border-gray-600 py-3 px-5 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500",
  showValidationCheck = false,
  disabled = false,
  alphabetOnly = false,
}: InputFieldProps) => {
  const { control } = useFormContext();
  const [attemptedInvalid, setAttemptedInvalid] = useState(false);

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

  // Email validation (unless overridden)
  if (type === "email") {
    validationRules.pattern = {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Please enter a valid email address",
      ...rules?.pattern,
    };
  }

  // Alphabet
  if (alphabetOnly) {
    validationRules.validate = (value: string) => {
      if (!value || value.trim() === "")
        return requiredMessage || "This field is required.";

      // allow letters
      if (/[^a-zA-Z\s-]/.test(value))
        return "Only letters are allowed.";

      return true;
    };
  }

  /** Restriction logic based on inputMode */
  const allowInput = (value: string) => {
    if (inputMode === "number") {
      return /^\d*\.?\d*$/.test(value);
    }

    if (inputMode === "string") {
      return /^[A-Za-z\s]*$/.test(value); // Only letters
    }

    return true; // both allowed
  };

  return (
    <div className={containerClassName}>
      {isShowLabel && (
        <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
  {label}
  {required !== false && <span className="text-red-600">*</span>}
</label>

      )}

      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field, fieldState: { error, isDirty, invalid } }) => (
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
                type={type}
                placeholder={placeholder || label}
                disabled={disabled}
                className={`${inputClassName} ${leftIcon ? "pl-10" : ""} ${
                  showValidationCheck && isDirty && !invalid ? "pr-10" : ""
                } ${invalid ? "border-red-500 dark:border-red-400" : ""}`}
              onChange={(e) => {
                  let value = e.target.value;

                  // alphabet-only sanitization: letters + spaces only
                  if (alphabetOnly) {
                    const sanitized = value.replace(/[^a-zA-Z\s-]/g, "");
                    setAttemptedInvalid(sanitized !== value);
                    value = sanitized;
                  }

                  field.onChange(value);
                }}
                onBlur={(e) => {
                  if (type === "number") {
                    const trimmed = e.target.value.trim();
                    field.onChange(trimmed);
                  }
                }}
                className={`${inputClassName}
                w-full rounded-md border border-gray-300 dark:border-gray-600 py-3 px-5  text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition
                       ${leftIcon ? "pl-10" : ""} 
                  ${showValidationCheck && isDirty && !invalid ? "pr-10" : ""} 
                  ${
                    disabled
                      ? " cursor-not-allowed opacity-60 border-gray-400 dark:border-gray-600 focus:ring-0"
                      : "cursor-text bg-white dark:bg-gray-800"
                  }
               ${
                 error && !disabled
                   ? "border-red-500 focus:ring-1 focus:ring-red-400"
                   : "border-gray-300 dark:border-gray-600 focus:ring-primary/40"
               }
              `}
              />

              {showValidationCheck && isDirty && !invalid && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                  ✓
                </div>
              )}
            </div>

            {/* Inline error from attempted invalid input */}
            {alphabetOnly && attemptedInvalid && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                Only letters  are allowed.
              </p>
            )}

            {/* Inline error from RHF validation */}
            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500" role="alert">
                {error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};
