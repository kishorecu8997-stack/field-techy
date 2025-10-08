import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";

interface InputFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "email" | "number" | "date";
  /** Additional react-hook-form validation rules */
  rules?: RegisterOptions;
  /** Icon to display on the left side of input */
  leftIcon?: React.ReactNode;
  /** Custom className for the input container */
  containerClassName?: string;
  /** Custom className for the input field */
  inputClassName?: string;
  /** Show validation checkmark when valid */
  showValidationCheck?: boolean;
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
  leftIcon,
  containerClassName = "flex flex-col py-1 w-full",
  inputClassName = "w-full rounded-md border border-gray-300 dark:border-gray-600 py-3 px-5 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500",
  showValidationCheck = false,
}: InputFieldProps) => {
  const { control } = useFormContext();

  // Default validation rules
  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    ...rules,
  };

  // Add email pattern validation if type is email
  if (type === "email") {
    validationRules.pattern = {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
      ...rules?.pattern, // merge with custom pattern if provided
    };
  }

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
                className={`${inputClassName} ${leftIcon ? "pl-10" : ""} ${
                  showValidationCheck && isDirty && invalid ? "pr-10" : ""
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