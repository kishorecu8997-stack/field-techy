import { Controller, useFormContext } from "react-hook-form";

interface InputFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "email" | "number" | "date";
}

/**
 * InputField - A reusable input component for react-hook-form.
 *
 * This component supports text, email, number, and date types.
 * It integrates with `react-hook-form` using `Controller`.
 * Light and dark mode styling is included via Tailwind CSS classes.
 *
 * @param {string} name - The name of the input field in the form.
 * @param {string} [label] - Optional label displayed above the input.
 * @param {string} [placeholder] - Placeholder text inside the input.
 * @param {boolean} [required=false] - Whether the field is required.
 * @param {"text" | "email" | "number" | "date"} [type="text"] - Type of input field.
 *
 * @example
 * <InputField name="username" label="Username" placeholder="Enter username" required />
 * <InputField name="email" label="Email" type="email" placeholder="Enter email" />
 */
export const InputField = ({
  name,
  label,
  placeholder,
  required = false,
  type = "text",
}: InputFieldProps) => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col py-4 gap-2">
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
            <input
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
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
