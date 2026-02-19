import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";

/**
 * ClientDocuments component handles the document upload section of the client creation/editing form.
 * It provides file upload inputs for required client documents.
 *
 * Required Documents:
 * - Government ID Proof
 * - Qualification Certificate
 */
export default function Documents() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4">
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
    </div>
  );
}
