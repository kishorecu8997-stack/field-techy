import { Controller, useFormContext } from "react-hook-form";
import type { TextareaInputProps } from "./type";

/**
 * TextareaInput - A reusable textarea component for react-hook-form.
 *
 * Features:
 * - Supports multi-line input.
 * - Integrated with react-hook-form using Controller.
 * - Supports light/dark theme styling via Tailwind CSS.
 *
 * @param {string} name - The name of the textarea field in the form.
 * @param {string} [label] - Optional label displayed above the textarea.
 * @param {string} [placeholder] - Placeholder text inside the textarea.
 * @param {boolean} [required=false] - Whether the field is required.
 *
 * @example
 * <TextareaInput name="bio" label="Bio" placeholder="Tell us about yourself" required />
 */
export const TextareaInput = ({ name, label, placeholder, required = false }: TextareaInputProps) => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col py-4 gap-1">
      {label && (
        <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field, fieldState: { error } }) => (
          <>
            <textarea
              {...field}
              id={name}
              placeholder={placeholder || label}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-3 px-5 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary transition"
              required={required}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">{`${label} is required`}</p>
            )}
          </>
        )}
      />
    </div>
  );
};