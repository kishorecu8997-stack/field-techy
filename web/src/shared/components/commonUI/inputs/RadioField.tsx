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
  /** Additional react-hook-form validation rules */
  rules?: RegisterOptions;
  /** Custom className for the container */
  containerClassName?: string;
  /** Custom className for each radio item */
  radioItemClassName?: string;
  /** Custom className for the radio input itself */
  radioInputClassName?: string;
}

/**
 * RadioField - A reusable radio group component for react-hook-form.
 *
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
  containerClassName = "flex flex-col py-1 w-full",
  radioItemClassName = "flex items-center mb-2",
  radioInputClassName = "h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 focus:ring-2",
}: RadioFieldProps) => {
  const { control } = useFormContext();

  // Default validation rules
  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    ...rules,
  };

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
        render={({ field: { onChange, onBlur, value, name: fieldName }, fieldState: { error } }) => (
          <>
            <div>
              {options.map((option) => (
                <label key={option.value} className={radioItemClassName}>
                  <input
                    type="radio"
                    name={fieldName}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    className={radioInputClassName}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">{option.label}</span>
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