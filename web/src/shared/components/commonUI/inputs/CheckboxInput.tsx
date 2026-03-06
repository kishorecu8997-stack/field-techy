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
  rules?: RegisterOptions;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  renderError?: boolean;
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
  disabled = false,
  onChange,
  onBlur,
  renderError = true,
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
          <div className="flex flex-col">
            <div className="flex items-center gap-1 dark:bg-gray-800 dark:border-gray-700">
              <input
                {...field}
                type="checkbox"
                id={name}
                checked={field.value || false}
                aria-controls="endDateSection"
                className="mt-[2px] [&:not(:checked)]:accent-gray-400 [&:checked]:accent-gray-500 dark:[&:not(:checked)]:accent-gray-900 dark:[&:checked]:accent-gray-200 cursor-pointer"
                disabled={disabled}
                onBlur={(e) => {
                  field.onBlur();
                  if (onBlur) onBlur(e);
                }}
                onChange={(e) => {
                  field.onChange(e);
                  if (onChange) onChange(e);
                  if (rules?.onChange) rules.onChange(e);
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
                  className="text-gray-700 dark:text-gray-300"
                >
                  {secondaryLabel}
                </label>
              )}
            </div>

            {/* Only render internal error if renderError is true */}
            {renderError && error && (
              <p className="mt-1 ml-6 text-sm text-red-600 dark:text-red-500">
                {error.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};
