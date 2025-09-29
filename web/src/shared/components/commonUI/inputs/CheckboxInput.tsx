import { Controller, useFormContext } from "react-hook-form";

interface CheckboxInputProps {
  name: string;
  label?: string;
  required?: boolean;
}

/**
 * CheckboxInput - A reusable checkbox component for react-hook-form.
 *
 * This component integrates with `react-hook-form` using `Controller`.
 * It supports light and dark mode styling via Tailwind CSS classes.
 *
 * @param {string} name - The name of the checkbox field in the form.
 * @param {string} [label] - Optional label text displayed next to the checkbox.
 * @param {boolean} [required=false] - Whether the checkbox is required.
 *
 * @example
 * <CheckboxInput name="agree" label="I agree to the terms" required />
 */
export const CheckboxInput = ({ name, label, required = false }: CheckboxInputProps) => {
  const { control } = useFormContext();

  return (
    <div className="flex items-center gap-2 py-2">
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field, fieldState: { error } }) => (
          <>
            <input
              {...field}
              type="checkbox"
              id={name}
              checked={field.value || false}
              className="accent-primary"
            />
            {label && <label htmlFor={name} className="text-gray-700 dark:text-gray-300">{label}</label>}
            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">{`${label} is required`}</p>
            )}
          </>
        )}
      />
    </div>
  );
};
