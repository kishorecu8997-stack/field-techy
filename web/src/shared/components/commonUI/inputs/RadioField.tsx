import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";

interface RadioOption {
  label: string;
  value: string | number;
}

interface RadioFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  options: RadioOption[];
  rules?: RegisterOptions;
  direction?: "vertical" | "horizontal"; // 👈 new prop
  containerClassName?: string;
  radioItemClassName?: string;
  radioInputClassName?: string;
  wrapperClassName?: string;
  disabled?: boolean;
}

/**
 * RadioField - A reusable radio group component for react-hook-form.
 *
 * Supports both vertical and horizontal layouts.
 * Accepts an array of options (label/value).
 * Integrates with react-hook-form using Controller.
 * Shows a * if required.
 * Supports custom styling via class names.
 */
export const RadioField = ({
  name,
  label,
  required = false,
  options,
  rules,
  direction = "vertical", // 👈 default layout
  containerClassName = "flex flex-col py-1 w-full",
  radioItemClassName = "flex items-center mb-2",
  radioInputClassName = "h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 focus:ring-2",
  wrapperClassName,
  disabled = false,
}: RadioFieldProps) => {
  const { control } = useFormContext();

  // Default validation rules
  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    ...rules,
  };

  // Dynamically set layout direction
  const layoutClass =
    direction === "horizontal"
      ? "flex flex-row flex-wrap gap-4" // horizontal
      : "flex flex-col"; // vertical

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block mb-2 text-md font-bold text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({
          field: { onChange, onBlur, value, name: fieldName },
          fieldState: { error },
        }) => (
          <>
            <div
              className={`${wrapperClassName} ${layoutClass} ${
                disabled ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              {options.map((option) => (
                <label
                  key={option.value}
                  className={`${radioItemClassName} ${
                    disabled
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer"
                  }`}
                >
                  <input
                    type="radio"
                    name={fieldName}
                    value={option.value}
                    checked={value === option.value}
                    onChange={() => !disabled && onChange(option.value)}
                    onBlur={onBlur}
                    className={`${radioInputClassName} ${
                      disabled ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    {option.label}
                  </span>
                </label>
              ))}
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
