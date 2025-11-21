import { Controller, useFormContext, type RegisterOptions } from "react-hook-form";


export interface TextareaInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  isShowLabel?: boolean;
  required?: boolean | string;
  rules?: RegisterOptions;
  containerClassName?: string;
  textareaClassName?: string;
  disabled?: boolean;
}

/**
 * TextareaInput - A reusable textarea component for react-hook-form.
 *
 * Features:
 * - Supports multi-line input.
 * - Integrated with react-hook-form using Controller.
 * - Customizable label, placeholder, validation, and styles.
 * - Supports required validation (boolean or string).
 * - Compatible with dark/light themes via Tailwind.
 */
export const TextareaInput = ({
  name,
  label,
  placeholder,
  isShowLabel = true,
  required = false,
  rules,
  containerClassName = "flex flex-col py-1 w-full",
  textareaClassName = "w-full rounded-md border border-gray-300 dark:border-gray-600 py-3 px-5 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary transition",
  disabled = false,
}: TextareaInputProps) => {
  const { control } = useFormContext();

  // Build required validation message
  let requiredMessage: string | false = false;
  if (typeof required === "string") {
    requiredMessage = required;
  } else if (required === true) {
    requiredMessage = `${label || name} is required`;
  }

  // Merge required with custom rules
  const validationRules: RegisterOptions = {
    required: requiredMessage,
    ...rules,
  };

  return (
    <div className={containerClassName}>
     {isShowLabel && (
        <label
          className={`block mb-1 text-md font-bold 
            ${
              disabled
                ? "text-gray-400 dark:text-gray-600"
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
        rules={validationRules}
        render={({ field, fieldState: { error } }) => (
          <>
            <textarea
              {...field}
              id={name}
              placeholder={placeholder || label}
              disabled={disabled}
              className={textareaClassName}
              rows={4}
            />
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
