import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";

interface CheckboxInputProps {
  name: string;
  label?: string;
  isShowLabel?: boolean;
  required?: boolean;
  secondaryLabel?: string;
  /** Optional react-hook-form validation rules */
  rules?: RegisterOptions;
}

/**
 * CheckboxInput - A reusable checkbox component for react-hook-form.
 *
 * Features:
 * - Supports required and custom validation rules.
 * - Integrates with react-hook-form using Controller.
 * - Light/dark mode styling via Tailwind CSS.
 */
export const CheckboxInput = ({
  name,
  label,
  isShowLabel = true,
  required = false,
  rules,
  secondaryLabel,
}: CheckboxInputProps) => {
  const { control } = useFormContext();

  // Merge required rule with custom rules
  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    ...rules,
  };

  return (
    <div className="flex flex-col py-2">
      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field, fieldState: { error } }) => (
          <>
            <div className="flex items-center gap-1">
              <input
                {...field}
                type="checkbox"
                id={name}
                checked={field.value || false}
                aria-controls="endDateSection"
                className="accent-primary mt-[2px]"
                onChange={(e) => {
                  field.onChange(e);  
                  if (rules?.onChange) {
                    rules.onChange(e);
                  }
                }}
              />


              {isShowLabel && (
                <label
                  htmlFor={name}
                  className="text-gray-700 font-medium dark:text-gray-300"
                >
                  {label} {required && <span className="text-red-600">*</span>}
                </label>
              )}
              {secondaryLabel && (
                <label
                  htmlFor={name}
                  className="text-gray-500 dark:text-gray-400"
                >
                  {secondaryLabel}
                </label>
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
