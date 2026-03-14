import { InputField, TextareaInput } from "@/shared/components/commonUI/inputs";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { Dispatch, SetStateAction } from "react";
import { validateAlphabeticTextArea, validateQuestion } from "@/utils/validate";
import { IoCloseSharp } from "react-icons/io5";

interface AddFaqProps {
  faqMode: "Add" | "Edit";
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  isLoading?: boolean;
  validateSortOrder: (value: number) => true | string;
}

/**
 * Form component for adding or editing a Frequently Asked Question (FAQ).
 * Typically rendered inside a modal dialog.
 *
 * @component
 * @example
 * <FaqForm
 *   faqMode="Add"
 *   setIsModalOpen={setModalOpen}
 *   isLoading={isSubmitting}
 * />
 */
export default function FaqForm({
  faqMode,
  setIsModalOpen,
  isLoading = false,
  validateSortOrder,
}: AddFaqProps) {
  const handleClose = () => {
    if (!isLoading) {
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <div className="p-4">
        {/* Header with title and close button */}
        <div className="flex justify-between items-center mb-6 dark:text-gray-200">
          <h2 className="text-lg font-bold">
            {faqMode === "Add" ? "Add New" : "Edit"} FAQ
          </h2>

          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            aria-label="Close FAQ form"
            title="Close"
            className={`
              p-1 rounded-full text-gray-500 hover:text-gray-800 
              dark:text-gray-400 dark:hover:text-gray-200
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            `}
          >
            <IoCloseSharp className="w-6 h-6" />
          </button>
        </div>

        {/* Form fields */}
        <div className="grid w-full gap-5">
          <InputField
            name="question"
            label="Question"
            type="text"
            required
            rules={{
              required: "Question is required",
              validate: validateQuestion,
            }}
            disabled={isLoading}
          />

          <TextareaInput
            name="answer"
            label="Answer"
            required
            rules={{
              validate: (v: string) =>
                validateAlphabeticTextArea(v, {
                  minLength: 50,
                  maxLength: 2000,
                  required: true,
                }),
            }}
            disabled={isLoading}
          />

          <InputField
            name="sortOrder"
            label="Sort Order"
            type="number"
            required
            rules={{
              required: "Sort order is required",
              min: {
                value: 0,
                message: "Sort order must be 0 or greater",
              },
              valueAsNumber: true,
              validate: validateSortOrder,
            }}
            placeholder="0"
            disabled={isLoading}
          />
        </div>

        {/* Submit button */}
        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            className="w-fit bg-gradient-to-r bg-teal-900 text-white py-1 rounded-lg hover:opacity-90 transition"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : faqMode === "Add"
                ? "Add FAQ"
                : "Update FAQ"}
          </Button>
        </div>
      </div>
    </div>
  );
}
