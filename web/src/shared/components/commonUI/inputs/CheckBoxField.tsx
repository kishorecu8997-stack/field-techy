import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";

interface CheckboxOption {
  label: string;
  value: string | number;
}

interface CheckboxFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  options: CheckboxOption[];
  rules?: RegisterOptions;
  direction?: "vertical" | "horizontal";
  containerClassName?: string;
  itemClassName?: string;
  inputClassName?: string;
  wrapperClassName?: string;
}

/**
 * CheckboxField - Reusable checkbox group for react-hook-form.
 *
 * Supports multi-select.
 * Works with Controller.
 * Vertical / horizontal layouts.
 */
export const CheckboxField = ({
  name,
  label,
  required = false,
  options,
  rules,
  direction = "vertical",
  containerClassName = "flex flex-col py-1 w-full",
  itemClassName = "flex items-center mb-2",
  inputClassName = "h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 focus:ring-2",
  wrapperClassName = "items-center border pl-2 pt-2 border-gray-300 rounded-sm bg-white dark:bg-gray-800 dark:text-white", // 👈 default wrapper
}: CheckboxFieldProps) => {
  const { control } = useFormContext();

  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    ...rules,
  };

  const layoutClass =
    direction === "horizontal"
      ? "flex flex-row flex-wrap gap-4"
      : "flex flex-col";

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
          field: { onChange, onBlur, value = [] },
          fieldState: { error },
        }) => {
          const handleSelect = (val: string | number) => {
            if (value.includes(val)) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange(value.filter((v: any) => v !== val));
            } else {
              onChange([...value, val]);
            }
          };

          return (
            <>
              {/* 👇 wrapper className now customizable */}
              <div className={`${wrapperClassName} ${layoutClass}`}>
                {options.map((option) => (
                  <label key={option.value} className={itemClassName}>
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={value.includes(option.value)}
                      onChange={() => handleSelect(option.value)}
                      onBlur={onBlur}
                      className={inputClassName}
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
          );
        }}
      />
    </div>
  );
};
