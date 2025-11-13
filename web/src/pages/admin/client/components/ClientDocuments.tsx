import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import { useFormContext } from "react-hook-form";
import type { ClientFormData } from "../types";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";

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
 * tsx
 * <FormProvider {...methods}>
 *   <Documents />
 * </FormProvider>
 *
 *
 * @remarks
 * This component must be used within a FormProvider context as it relies on
 * form context for file upload handling and validation.
 *
 * @returns {JSX.Element} A form section component with document upload fields
 */
export default function UserDocuments() {
  const methods = useFormContext<ClientFormData>();
  const handleSubmit = (data: ClientFormData) => {
    console.log("Documents submitted:", data);
  };
  return (
    <div>
      <FormContainer
        methods={methods}
        onSubmit={handleSubmit}
        className="flex p-2 gap-4"
      >
        <div className="grid md:flex mb-6 mt-2 md:w-8/12 gap-8 justify-between">
          {/* Government ID Proof */}
          <div className="w-120">
            <div>
              <FileUpload
                name="governmentIDProof"
                label="Government ID Proof"
                placeholder="Upload Government ID Proof"
                accept=".pdf,.jpg,.png"
                maxPages={5}
                validatePDF={true}
                required
              />
            </div>
          </div>

          {/* Qualification Certificate */}
          <div className="w-120">
            <div>
              <FileUpload
                name="qualificationCertificate"
                label="Qualification Certificate"
                placeholder="Upload Qualification Certificate"
                accept=".pdf,.jpg,.png"
                maxPages={5}
                validatePDF={true}
                required
              />
            </div>
          </div>
        </div>
      </FormContainer>
    </div>
  );
}
