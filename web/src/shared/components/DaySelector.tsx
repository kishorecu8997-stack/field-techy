import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";

interface DaySelectorProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean | string;
  rules?: RegisterOptions<T>;
  isShowLabel?: boolean;
  containerClassName?: string;
  selectorClassName?: string;
  disabled?: boolean;
}

/**
 * A component for selecting days of the week.
 *
 * @param {DaySelectorProps<T>} props - Props for the DaySelector component.
 * @returns {JSX.Element} The rendered DaySelector component.
 */
const DaySelector = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  rules = {},
  isShowLabel = true,
  containerClassName = "flex flex-col py-1 w-full",
  selectorClassName = "",
  disabled = false,
}: DaySelectorProps<T>) => {
  // Build required message
  let requiredMessage: string | false = false;
  if (typeof required === "string") {
    requiredMessage = required;
  } else if (required === true) {
    requiredMessage = `${label || name} is required`;
  }

  const finalRules: RegisterOptions<T> = {
    ...rules,
    ...(rules.required === undefined &&
      rules.validate === undefined && {
        required: requiredMessage,
      }),
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <Controller
      name={name}
      control={control}
      rules={finalRules}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const selectedDays = (Array.isArray(value) ? value : []) as string[];

        const handleToggle = (day: string) => {
          if (disabled) return; // 🚫 Prevent toggle when disabled

          const newSelected = selectedDays.includes(day)
            ? selectedDays.filter((d) => d !== day)
            : [...selectedDays, day];

          onChange(newSelected);
        };

        return (
          <div
            className={`${containerClassName} ${
              disabled ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isShowLabel && (
              <label
                className={`block mb-1 text-md font-bold ${
                  disabled
                    ? "text-gray-400 dark:text-gray-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {label}{" "}
                {required !== false && <span className="text-red-600">*</span>}
              </label>
            )}

            <div
              className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex flex-wrap gap-3 ${
                disabled
                  ? "cursor-not-allowed bg-gray-100 dark:bg-gray-900"
                  : ""
              } ${selectorClassName}`}
            >
              {days.map((day) => {
                const isSelected = selectedDays.includes(day);

                return (
                  <label
                    key={day}
                    className={`flex items-center ${
                      disabled ? "cursor-not-allowed" : "cursor-pointer"
                    } dark:text-white`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(day)}
                      className="sr-only"
                      disabled={disabled}
                    />

                    <div
                      className={`flex items-center justify-center h-4 w-4 rounded border transition
                        ${
                          disabled
                            ? "border-gray-400 bg-gray-300 dark:bg-gray-700 dark:border-gray-600"
                            : isSelected
                            ? "bg-teal-900 border-teal-900"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                    >
                      {isSelected && (
                        <span
                          className={`text-xs ${
                            disabled
                              ? "text-gray-600 dark:text-gray-400"
                              : "text-white"
                          }`}
                        >
                          ✓
                        </span>
                      )}
                    </div>

                    <span
                      className={`ml-2 text-sm ${
                        disabled
                          ? "text-gray-500 dark:text-gray-500"
                          : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {day}
                    </span>
                  </label>
                );
              })}
            </div>

            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                {error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};

export default DaySelector;
