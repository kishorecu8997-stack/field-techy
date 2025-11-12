import FileUpload from "@/shared/components/commonUI/inputs/FileUpload";

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
export default function Documents() {

  return (
    <div>
      {/* <FormContainer methods={methods} className="flex p-2 gap-4"> */}
        <div className="grid md:flex mb-6 mt-2 md:w-8/12 gap-8 justify-between">
          <div className="w-60">
            <FileUpload
              name="governmentId"
              label="Goverment ID Proof"
              placeholder="Government ID"
              required
            />
          </div>
          <div className="w-60">
            <FileUpload
              name="certificate"
              label="Qualification Certificate"
              placeholder="Certificate"
              required
            />
          </div>
        </div>
      {/* </FormContainer> */}
    </div>
  );
}
