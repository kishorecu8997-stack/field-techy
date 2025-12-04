import { useState } from "react";
import { Controller, useFormContext, type RegisterOptions } from "react-hook-form";

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
  allowedCharacters?: "numbers" | "numbers-dot" | "alphanumeric" | "digits-slash" | "currency";

}

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
  allowedCharacters,
}: InputFieldProps) => {
  const { control } = useFormContext();
  const [attemptedInvalid, setAttemptedInvalid] = useState(false);

  // Build required validation message
  const requiredMessage = typeof required === "string" ? required : required ? `${label || name} is required` : false;

  // Merge required with other rules
  const validationRules: RegisterOptions = {
    required: requiredMessage,
    ...rules,
    validate: (value: string) => {
      if (!value || value.trim() === "") return requiredMessage || "This field is required.";
      if (allowedCharacters) {
        let pattern: RegExp;
        let errorMessage = "Invalid input.";
        switch (allowedCharacters) {
          case "numbers":
            pattern = /^[0-9]*$/;
            errorMessage = "This field may contain numbers only.";
            break;
          case "numbers-dot":
            pattern = /^[0-9]*\.?[0-9]*$/;
            errorMessage = "Only numbers and '.' are allowed.";
            break;
          case "alphanumeric":
            pattern = /^[a-zA-Z0-9]*$/;
            errorMessage = "Only letters and numbers are allowed.";
            break;
          case "digits-slash":
            pattern = /^[0-9/]*$/;
            errorMessage = "Only digits and '/' are allowed.";
            break;
          case "currency":
            pattern = /^[0-9.$]*$/;
            errorMessage = "Only numbers, '.' and '$' are allowed.";
            break;


        }

        if (!pattern.test(value)) return errorMessage;
      }
      return true;
    },
  };

  return (<div className={containerClassName}>
    {isShowLabel && (<label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
      {label} {required && <span className="text-red-600">*</span>} </label>
    )}
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({ field, fieldState: { error, isDirty, invalid } }) => (
        <> <div className="relative">
          {leftIcon && (<div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {leftIcon} </div>
          )}
          <input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder || label}
            disabled={disabled}
            className={`${inputClassName} ${leftIcon ? "pl-10" : ""} ${showValidationCheck && isDirty && !invalid ? "pr-10" : ""
              } ${invalid ? "border-red-500 dark:border-red-400" : ""}`}
            onChange={(e) => {
              let value = e.target.value;
              if (allowedCharacters) {
                let regex: RegExp;
                switch (allowedCharacters) {
                  case "numbers":
                    regex = /[^0-9]/g;
                    break;
                  case "numbers-dot":
                    regex = /[^0-9.]/g;
                    break;
                  case "alphanumeric":
                    regex = /[^a-zA-Z0-9]/g;
                    break;
                  case "digits-slash":
                    regex = /[^0-9/]/g;
                    break;
                  case "currency":
                    regex = /[^0-9.$]/g; 
                    break;
                }

                const sanitized = value.replace(regex!, "");
                setAttemptedInvalid(sanitized !== value);
                value = sanitized;
              }
              field.onChange(value);
            }}
          />
          {showValidationCheck && isDirty && !invalid && (<div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">✓</div>
          )} </div>


          {/* Inline error for attempted invalid input */}
          {attemptedInvalid && allowedCharacters && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {allowedCharacters === "numbers" && "This field may contain numbers only."}
              {allowedCharacters === "numbers-dot" && "Only numbers and '.' are allowed."}
              {allowedCharacters === "alphanumeric" && "Only letters and numbers are allowed."}
              {allowedCharacters === "digits-slash" && "Only digits and '/' are allowed."}
              {allowedCharacters === "currency" && "Only numbers, '.' and '$' are allowed."}

            </p>
          )}

          {/* RHF validation error */}
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
