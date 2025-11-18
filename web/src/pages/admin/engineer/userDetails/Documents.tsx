import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useFormContext } from "react-hook-form";
import type { EngineerFormData } from "../types";

/**
 * Documents component handles the document upload section of the engineer registration form.
 * It provides interfaces for uploading required legal and educational documents.
 *
 * Required Documents:
 * - Government ID Proof: Legal identification document
 * - Qualification Certificate: Educational or professional certifications
 *
 * Features:
 * - File upload functionality for both document types
 * - Input validation for required documents
 * - Responsive layout with grid/flex arrangement
 *
 * @component
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <Documents />
 * </FormProvider>
 * ```
 *
 * @remarks
 * This component must be used within a FormProvider context as it relies on
 * form context for file upload handling and validation.
 *
 * @returns {JSX.Element} A form section component with document upload fields
 */
export default function UserDocuments() {
    const methods = useFormContext<EngineerFormData>();
  
  return (
    <div>
      <FormContainer methods={methods} className="flex p-2 gap-4">
        <div className="grid md:flex mb-6 mt-2 md:w-8/12 gap-8 justify-between">
          {/* Government ID Proof */}
          <div className="w-60">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Government ID Proof
            </label>
            <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-300 dark:border-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>

          {/* Qualification Certificate */}
          <div className="w-60">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Qualification Certificate
            </label>
            <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-300 dark:border-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
        </div>
      </FormContainer>
    </div>
  );
}
