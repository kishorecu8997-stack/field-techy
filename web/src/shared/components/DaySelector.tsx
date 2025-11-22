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
}

const DaySelector = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  rules = {},
  isShowLabel = true,
  containerClassName = "flex flex-col py-1 w-full",
  selectorClassName = "",
}: DaySelectorProps<T>) => {

  // Build required message
  let requiredMessage: string | false = false;
  if (typeof required === "string") {
    requiredMessage = required;
  } else if (required === true) {
    requiredMessage = `${label || name} is required`;
  }

  // Apply required only if not handled by rules
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
          const newSelected = selectedDays.includes(day)
            ? selectedDays.filter((d) => d !== day)
            : [...selectedDays, day];
          onChange(newSelected);
        };

        const showAsterisk =
          isShowLabel && Boolean(label) && required !== false;

        return (
          <div className={containerClassName}>
            {isShowLabel && label && (
              <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
                {label}
                {showAsterisk && <span className="text-red-600">*</span>}
              </label>
            )}

            <div
              className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex flex-wrap gap-3 ${selectorClassName}`}
            >
              {days.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <label
                    key={day}
                    className="flex items-center cursor-pointer dark:text-white"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(day)}
                      className="sr-only"
                    />
                    <div
                      className={`flex items-center justify-center h-4 w-4 rounded border ${
                        isSelected
                          ? "bg-teal-900 border-teal-900"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {isSelected && (
                        <span className="text-xs text-white">✓</span>
                      )}
                    </div>
                    <span className="ml-2 text-sm text-gray-800 dark:text-gray-200">
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
