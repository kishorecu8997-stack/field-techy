import { Controller, useFormContext } from "react-hook-form";

interface SwitchInputProps {
  name: string;
  label?: string;
  required?: boolean;
}

/**
 * SwitchInput - A reusable toggle switch component for react-hook-form.
 *
 * Features:
 * - Styled as a toggle switch with light/dark mode support.
 * - Integrated with react-hook-form using Controller.
 *
 * @param {string} name - The name of the switch field in the form.
 * @param {string} [label] - Optional label displayed next to the switch.
 * @param {boolean} [required=false] - Whether the field is required.
 *
 * @example
 * <SwitchInput name="newsletter" label="Subscribe to newsletter" />
 */
export const SwitchInput = ({ name, label, required = false }: SwitchInputProps) => {
  const { control } = useFormContext();

  return (
    <div className="flex items-center gap-2 py-2">
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field, fieldState: { error } }) => (
          <>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...field}
                checked={field.value || false}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary transition-all"></div>
              {label && <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
            </label>
            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">{`${label} is required`}</p>
            )}
          </>
        )}
      />
    </div>
  );
};