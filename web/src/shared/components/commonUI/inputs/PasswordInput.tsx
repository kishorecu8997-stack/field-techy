import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface PasswordInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

/**
 * PasswordInput - A reusable password input component for react-hook-form.
 *
 * Features:
 * - Show/hide password toggle button.
 * - Supports light and dark theme styling via Tailwind CSS.
 * - Integrated with react-hook-form using Controller.
 *
 * @param {string} name - The name of the password field in the form.
 * @param {string} [label] - Optional label displayed above the input.
 * @param {string} [placeholder] - Placeholder text inside the input.
 * @param {boolean} [required=false] - Whether the field is required.
 *
 * @example
 * <PasswordInput name="password" label="Password" placeholder="Enter your password" required />
 */
export const PasswordInput = ({ name, label, placeholder, required = false }: PasswordInputProps) => {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col py-4 gap-2 relative">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field, fieldState: { error } }) => (
          <>
            <div className="relative">
              <input
                {...field}
                id={name}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-3 px-5 pr-12 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary transition"
                required={required}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">{`${label} is required`}</p>
            )}
          </>
        )}
      />
    </div>
  );
};
