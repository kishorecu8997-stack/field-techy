import { useFormContext } from "react-hook-form";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import DocumentCard from "@/shared/components/DocumentCard";
import type { ClientFormData } from "../types";

/**
 * ClientDocuments component handles the document upload section of the client creation/editing form.
 * It provides file upload inputs for required client documents and shows a preview card for existing ones.
 *
 * Required Documents:
 * - Government ID Proof
 * - Qualification Certificate
 */
interface DocumentsProps {
  isView?: boolean;
}

export default function Documents({ isView = false }: DocumentsProps) {
  const { watch, setValue } = useFormContext<ClientFormData>();

  const govIdDoc = watch("govIdDoc");
  const certificate = watch("certificate");

  const isExistingFile = (value: unknown): value is string =>
    typeof value === "string" && value.startsWith("http");

  const handleEdit = (field: keyof ClientFormData) => {
    setValue(field, null, { shouldDirty: true, shouldValidate: true });
  };

  const handleDelete = (field: keyof ClientFormData) => {
    setValue(field, null, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4">
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:w-9/12">
        {/* Government ID Proof */}
        <div className="w-full">
          {isExistingFile(govIdDoc) ? (
            <div className="flex flex-col gap-2 xl:w-96">
              <DocumentCard
                id={1}
                document={{
                  title: "Government ID Proof",
                  fileName: govIdDoc.split("/").pop() || "gov-id.pdf",
                  fileType: "PDF",
                  previewUrl: govIdDoc,
                }}
                onEdit={isView ? undefined! : () => handleEdit("govIdDoc")}
                onDelete={isView ? undefined! : () => handleDelete("govIdDoc")}
                onDownload={() => window.open(govIdDoc, "_blank")}
              />
            </div>
          ) : (
            <FileUpload
              name="govIdDoc"
              label="Government ID Proof"
              placeholder="Upload Government ID Proof"
              accept=".pdf"
              maxPages={5}
              validatePDF={true}
              required
              disabled={isView}
            />
          )}
        </div>

        {/* Qualification Certificate */}
        <div className="w-full">
          {isExistingFile(certificate) ? (
            <div className="flex flex-col gap-2 xl:w-96">
              <DocumentCard
                id={2}
                document={{
                  title: "Certificate",
                  fileName: certificate.split("/").pop() || "certificate.pdf",
                  fileType: "PDF",
                  previewUrl: certificate,
                }}
                onEdit={isView ? undefined! : () => handleEdit("certificate")}
                onDelete={
                  isView ? undefined! : () => handleDelete("certificate")
                }
                onDownload={() => window.open(certificate, "_blank")}
              />
            </div>
          ) : (
            <FileUpload
              name="certificate"
              label="Certificate"
              placeholder="Upload Certificate"
              accept=".pdf"
              maxPages={5}
              validatePDF={true}
              required
              disabled={isView}
            />
          )}
        </div>
      </div>
    </div>
  );
}
