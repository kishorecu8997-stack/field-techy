import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useFormContext } from "react-hook-form";
import type { ClientFormData } from "../types";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";

/**
 * ClientDocuments component handles the document upload section of the client creation/editing form.
 * It provides file upload inputs for required client documents.
 *
 * Required Documents:
 * - Government ID Proof
 * - Qualification Certificate
 *
 * Features:
 * - File upload functionality for both document types
 * - Relies on `react-hook-form` for validation, which is expected to be provided by a parent component.
 *
 * @component
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <ClientDocuments />
 * </FormProvider>
 * ```
 *
 * @remarks
 * This component must be used within a `FormProvider` context from `react-hook-form`
 * as it uses `useFormContext` to register the file upload fields.
 *
 * @returns {JSX.Element} A form section for document uploads.
 */
export default function Documents() {
  const methods = useFormContext<ClientFormData>();
  const handleSubmit = (data: ClientFormData) => {
    console.log("Documents submitted:", data);
  };
  return (
    <div className="bg-white dark:bg-gray-800">
      <FormContainer
        methods={methods}
        onSubmit={handleSubmit}
        className="flex p-2 gap-4"
      >
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 md:w-8/12">
          {/* Government ID Proof */}
          <div className="w-full">
            <FileUpload
              name="governmentIDProof"
              label="Government ID Proof"
              placeholder="Upload Government ID Proof"
              accept=".pdf"
              maxPages={5}
              validatePDF={true}
              required
            />
          </div>

          {/* Qualification Certificate */}
          <div className="w-full">
            <FileUpload
              name="certificate"
              label="Certificate"
              placeholder="Upload Certificate"
              accept=".pdf"
              maxPages={5}
              validatePDF={true}
              required
            />
          </div>
        </div>
      </FormContainer>
    </div>
  );
}
