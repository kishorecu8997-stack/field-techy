import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";



interface TagSelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  maxTags?: number;
  options: string[];
}

export const TagSelectField = ({
  name,
  label,
  placeholder = "Select a tag...",
  required = false,
  rules,
  leftIcon,
  containerClassName = "flex flex-col py-1",
  inputClassName = "w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-4 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition",
  maxTags = 10,
  options = [],
}: TagSelectFieldProps) => {
  const { control } = useFormContext();
  
  const [selectedOption, setSelectedOption] = useState("");

  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    ...rules,
  };

  const handleAddTag = (
    tag: string,
    onChange: (value: string[]) => void,
    value: string[]
  ) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;

    if (value.includes(trimmedTag)) {
      toast.error("This tag is already selected.");
      return;
    }

    if (value.length >= maxTags) {
      toast.error(`You can select up to ${maxTags} tags only.`);
      return;
    }

    const newValue = [...value, trimmedTag];
    onChange(newValue);
    setSelectedOption("");
  };

  const removeTag = (
    index: number,
    onChange: (value: string[]) => void,
    value: string[]
  ) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={validationRules}
        render={({ field, fieldState: { error } }) => {
          const { onChange, value = [] } = field;

          return (
            <>
              <div className="relative">
                <div className="relative">
                  {leftIcon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10">
                      {leftIcon}
                    </div>
                  )}
                  <select
                    value={selectedOption}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setSelectedOption(selected);
                      handleAddTag(selected, onChange, value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag(selectedOption, onChange, value);
                      }
                    }}
                    className={`${inputClassName} ${leftIcon ? "pl-10" : ""}`}
                  >
                    <option value="">{placeholder}</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                  {error.message}
                </p>
              )}

              <div className="flex flex-wrap gap-2 py-2">
                {value.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full border border-teal-300 dark:border-teal-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index, onChange, value)}
                      className="ml-1 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </>
          );
        }}
      />
    </div>
  );
};

export default TagSelectField;
