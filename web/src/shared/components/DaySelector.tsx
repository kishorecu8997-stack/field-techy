import {
  Controller,
  type Control,
  type FieldValues,
  type RegisterOptions,
  type Path,
} from "react-hook-form";

interface CheckboxSelectorProps<T extends FieldValues> {
  name: Path<T>;
  control?: Control<T>;
  label?: string;
  required?: boolean | string;
  options: string[]; //NEW – dynamic options
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
  options,
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

  return (
    <Controller
      name={name}
      control={control}
      rules={finalRules}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const selected = Array.isArray(value) ? value : [];

<<<<<<< HEAD
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
=======
        const toggleOption = (item: string) => {
          if (disabled) return;
          const updated = selected.includes(item)
            ? selected.filter((x) => x !== item)
            : [...selected, item];
          onChange(updated);
        };

        return (
          <div className={containerClassName}>
            {isShowLabel && label && (
              <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
                {label}
                {required && <span className="text-red-600">*</span>}
>>>>>>> remotes/origin/dev
              </label>
            )}

            <div
              className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex flex-wrap gap-3 ${
                disabled
                  ? "cursor-not-allowed bg-gray-100 dark:bg-gray-900"
                  : ""
              } ${selectorClassName}`}
            >
<<<<<<< HEAD
              {days.map((day) => {
                const isSelected = selectedDays.includes(day);

                return (
                  <label
                    key={day}
                    className={`flex items-center ${
                      disabled ? "cursor-not-allowed" : "cursor-pointer"
=======
              {options.map((item) => {
                const selectedItem = selected.includes(item);
                return (
                  <label
                    key={item}
                    className={`flex items-center ${
                      disabled
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
>>>>>>> remotes/origin/dev
                    } dark:text-white`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItem}
                      onChange={() => toggleOption(item)}
                      className="sr-only"
                      disabled={disabled}
                    />

                    <div
<<<<<<< HEAD
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
=======
                      className={`flex items-center justify-center h-4 w-4 rounded border ${
                        selectedItem
                          ? "bg-teal-900 border-teal-900"
                          : "border-gray-300 dark:border-gray-600"
                      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      {selectedItem && (
                        <span className="text-xs text-white">✓</span>
                      )}
                    </div>
                    <span className="ml-2 text-sm text-gray-800 dark:text-gray-200">
                      {item}
>>>>>>> remotes/origin/dev
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

export default CheckboxSelector;
