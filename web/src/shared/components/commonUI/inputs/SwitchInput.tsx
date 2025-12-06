import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";

interface SwitchFieldProps {
  name: string;
  label?: string;
  isShowLabel?: boolean;
  required?: boolean | string;
  rules?: RegisterOptions;
  disabled?: boolean;
  containerClassName?: string;
}

export const SwitchInput = ({
  name,
  label,
  isShowLabel = true,
  required = false,
  rules,
  disabled = false,
  containerClassName = "flex flex-col py-1 w-full",
}: SwitchFieldProps) => {
  const { control } = useFormContext();

  // Build required message
  let requiredMessage: string | false = false;
  if (typeof required === "string") {
    requiredMessage = required;
  } else if (required === true) {
    requiredMessage = `${label || name} is required`;
  }

  const validationRules: RegisterOptions = {
    required: requiredMessage,
    ...rules,
  };

  return (
    <div className={containerClassName}>
      {isShowLabel && (
        <label className="mb-1 text-md font-semibold text-gray-700 dark:text-gray-300">
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
            <button
              type="button"
              disabled={disabled}
              onClick={() => field.onChange(!field.value)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                field.value
                  ? "bg-emerald-700 cursor-pointer"
                  : "bg-gray-200 dark:bg-gray-700 cursor-pointer"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`transform transition inline-block h-4 w-4 rounded-full bg-white dark:bg-gray-200 ${
                  field.value ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>

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
