// import {
//   Controller,
//   type Control,
//   type FieldValues,
//   type Path,
//   type RegisterOptions,
// } from "react-hook-form";

// interface DaySelectorProps<T extends FieldValues> {
//   name: Path<T>;
//   control: Control<T>;
//   label?: string;
//   required?: boolean | string;
//   rules?: RegisterOptions<T>;
//   isShowLabel?: boolean;
//   containerClassName?: string;
//   selectorClassName?: string;
//   disabled?: boolean;
// }

// /**
//  * A component for selecting days of the week.
//  *
//  * @param {DaySelectorProps<T>} props - Props for the DaySelector component.
//  * @returns {JSX.Element} The rendered DaySelector component.
//  */
// const DaySelector = <T extends FieldValues>({
//   name,
//   control,
//   label,
//   required = false,
//   rules = {},
//   isShowLabel = true,
//   containerClassName = "flex flex-col py-1 w-full",
//   selectorClassName = "",
//   disabled = false,
// }: DaySelectorProps<T>) => {
//   // Build required message
//   let requiredMessage: string | false = false;
//   if (typeof required === "string") {
//     requiredMessage = required;
//   } else if (required === true) {
//     requiredMessage = `${label || name} is required`;
//   }

//   const finalRules: RegisterOptions<T> = {
//     ...rules,
//     ...(rules.required === undefined &&
//       rules.validate === undefined && {
//         required: requiredMessage,
//       }),
//   };

//   const days = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//     "Sunday",
//   ];

//   return (
//     <Controller
//       name={name}
//       control={control}
//       rules={finalRules}
//       render={({ field: { value, onChange }, fieldState: { error } }) => {
//         const selectedDays = (Array.isArray(value) ? value : []) as string[];

//         const handleToggle = (day: string) => {
//           if (disabled) return; // 🚫 Prevent toggle when disabled

//           const newSelected = selectedDays.includes(day)
//             ? selectedDays.filter((d) => d !== day)
//             : [...selectedDays, day];

//           onChange(newSelected);
//         };

//         return (
//           <div
//             className={`${containerClassName} ${
//               disabled ? "opacity-60 cursor-not-allowed" : ""
//             }`}
//           >
//             {isShowLabel && (
//               <label
//                 className={`block mb-1 text-md font-bold ${
//                   disabled
//                     ? "text-gray-400 dark:text-gray-400"
//                     : "text-gray-700 dark:text-gray-300"
//                 }`}
//               >
//                 {label}{" "}
//                 {required !== false && <span className="text-red-600">*</span>}
//               </label>
//             )}

//             <div
//               className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex flex-wrap gap-3 ${
//                 disabled
//                   ? "cursor-not-allowed bg-gray-100 dark:bg-gray-900"
//                   : ""
//               } ${selectorClassName}`}
//             >
//               {days.map((day) => {
//                 const isSelected = selectedDays.includes(day);

//                 return (
//                   <label
//                     key={day}
//                     className={`flex items-center ${
//                       disabled ? "cursor-not-allowed" : "cursor-pointer"
//                     } dark:text-white`}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={isSelected}
//                       onChange={() => handleToggle(day)}
//                       className="sr-only"
//                       disabled={disabled}
//                     />

//                     <div
//                       className={`flex items-center justify-center h-4 w-4 rounded border transition
//                         ${
//                           disabled
//                             ? "border-gray-400 bg-gray-300 dark:bg-gray-700 dark:border-gray-600"
//                             : isSelected
//                             ? "bg-teal-900 border-teal-900"
//                             : "border-gray-300 dark:border-gray-600"
//                         }`}
//                     >
//                       {isSelected && (
//                         <span
//                           className={`text-xs ${
//                             disabled
//                               ? "text-gray-600 dark:text-gray-400"
//                               : "text-white"
//                           }`}
//                         >
//                           ✓
//                         </span>
//                       )}
//                     </div>

//                     <span
//                       className={`ml-2 text-sm ${
//                         disabled
//                           ? "text-gray-500 dark:text-gray-500"
//                           : "text-gray-800 dark:text-gray-200"
//                       }`}
//                     >
//                       {day}
//                     </span>
//                   </label>
//                 );
//               })}
//             </div>

//             {error && (
//               <p className="mt-1 text-sm text-red-600 dark:text-red-500">
//                 {error.message}
//               </p>
//             )}
//           </div>
//         );
//       }}
//     />
//   );
// };

// export default DaySelector;
import {
  Controller,
  useFormContext,
  type RegisterOptions,
} from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import { FaChevronDown } from "react-icons/fa";

interface TagOption {
  value: string;
  label: string;
}

interface TagSelectFieldProps {
  name: string;
  label?: string;
  isShowLabel?: boolean;
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  maxTags?: number;
  options: TagOption[]; // ✅ Updated type
  disabled?: boolean;
}

/**
 * A tag selection component for react-hook-form that allows users to select tags from a predefined list.
 * Selected tags are displayed as dismissible pills. It prevents duplicate selections and enforces a tag limit.
 */
export const TagSelectField = ({
  name,
  label,
  isShowLabel = true,
  placeholder = "Select a tag...",
  required = false,
  rules,
  leftIcon,
  containerClassName = "flex flex-col py-1",
  inputClassName = "w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-4 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition",
  maxTags = 10,
  options = [],
  disabled = false,
}: TagSelectFieldProps) => {
  const { control } = useFormContext();
  const [selectedOption, setSelectedOption] = useState("");

  const validationRules: RegisterOptions = {
    required: required ? `${label || name} is required` : false,
    ...rules,
  };

  const handleAddTag = (
    tagValue: string,
    onChange: (value: string[]) => void,
    value: string[]
  ) => {
    if (!tagValue) return;

    if (value.includes(tagValue)) {
      toast.error("This tag is already selected.");
      return;
    }

    if (value.length >= maxTags) {
      toast.error(`You can select up to ${maxTags} ${name} only.`);
      return;
    }

    const newValue = [...value, tagValue];
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
      {isShowLabel && (
        <label className="block mb-1 text-md font-bold text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={validationRules}
        disabled={disabled}
        render={({ field, fieldState: { error } }) => {
          const { onChange, value = [] } = field;

          // ✅ Filter out already selected tags
          const availableOptions = options.filter(
            (opt) => !value.includes(opt.value)
          );

          return (
            <>
              {/* Select wrapper */}
              <div className="relative">
                {leftIcon && (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10">
                    {leftIcon}
                  </div>
                )}

                {/* Wrapper for custom arrow */}
                <div className="relative">
                  <select
                    disabled={disabled}
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
                    className={`${inputClassName} ${leftIcon ? "pl-10" : ""
                      } pr-10 appearance-none ${error
                        ? "!border-red-500 focus:!ring-red-400 focus:!ring-1"
                        : ""
                      }`}
                  >
                    <option value="" disabled hidden>
                      {placeholder}
                    </option>

                    {availableOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {/* Custom dropdown arrow */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <FaChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>

              {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                  {error.message}
                </p>
              )}

              {/* Render selected tags */}
              <div className="flex flex-wrap gap-2 ">
                {value &&
                  value.map((tagValue: string, index: number) => {
                    // Find the label for display
                    const tagLabel =
                      options.find((opt) => opt.value === tagValue)?.label ||
                      tagValue;

                    return (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full border border-teal-300 dark:border-teal-700"
                      >
                        {tagLabel}
                        <button
                          type="button"
                          onClick={() => removeTag(index, onChange, value)}
                          className="ml-1 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 focus:outline-none"
                          aria-label={`Remove tag ${tagLabel}`}
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
              </div>
            </>
          );
        }}
      />
    </div>
  );
};

export default TagSelectField;
