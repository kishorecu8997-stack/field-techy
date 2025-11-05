import React from "react";
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";

interface TimeInputProps {
  name: string;
  label?: string;
  isShowLabel?: boolean;
  required?: boolean | string;
  placeholder?: string;
  rules?: RegisterOptions;
  containerClassName?: string;
  inputClassName?: string;
  leftIcon?: React.ReactNode;
  showValidationCheck?: boolean;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  name,
  label,
  isShowLabel = true,
  required = false,
  placeholder = "Select Time",
  rules,
  containerClassName = "flex flex-col py-1 w-full",
  inputClassName = "w-full rounded-md border border-gray-300 dark:border-gray-600 py-3 px-5 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500",
  leftIcon,
  showValidationCheck = false,
}) => {
  const { control } = useFormContext();

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
    <div className={containerClassName}>
      {isShowLabel && (
        <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
          {label}{" "}
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
                type="time"
                placeholder={placeholder}
                className={`${inputClassName} ${leftIcon ? "pl-10" : ""} ${
                  showValidationCheck && isDirty && !invalid ? "pr-10" : ""
                }`}
              />
              {showValidationCheck && isDirty && !invalid && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                  ✓
                </div>
              )}
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

export default TimeInput;