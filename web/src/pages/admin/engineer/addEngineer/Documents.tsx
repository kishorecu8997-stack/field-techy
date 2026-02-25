import { useFormContext } from "react-hook-form";
import { FileUpload } from "@/shared/components/commonUI/inputs/FileUpload";
import DocumentCard from "@/shared/components/DocumentCard";
import type { EngineerFormData } from "../types";

interface DocumentsProps {
  isView?: boolean; // toggle view-only mode
}

export default function Documents({ isView = false }: DocumentsProps) {
  const { watch, setValue } = useFormContext<EngineerFormData>();

  const governmentId = watch("governmentId");
  const certificate = watch("certificate");

  // Determine if a value is an existing file URL
  const isExistingFile = (value: unknown): value is string =>
    typeof value === "string" && value.startsWith("http");

  const handleEdit = (field: keyof EngineerFormData) => {
    setValue(field, null, { shouldDirty: true, shouldValidate: true });
  };

  const handleDelete = (field: keyof EngineerFormData) => {
    setValue(field, null, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4">
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:w-9/12">
        {/* Government ID Proof */}
        <div className="w-full">
          {isExistingFile(governmentId) ? (
            <div className="flex flex-col gap-2 xl:w-96">
              <DocumentCard
                id={1}
                document={{
                  title: "Government ID Proof",
                  fileName: governmentId.split("/").pop() || "gov-id.pdf",
                  fileType: "PDF",
                  previewUrl: governmentId,
                }}
                onEdit={isView ? undefined! : () => handleEdit("governmentId")}
                onDelete={
                  isView ? undefined! : () => handleDelete("governmentId")
                }
                onDownload={() => window.open(governmentId, "_blank")}
              />
            </div>
          ) : (
            <FileUpload
              name="governmentId"
              label="Government ID Proof"
              placeholder="Upload Government ID"
              accept=".pdf"
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
                  title: "Qualification Certificate",
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
              label="Qualification Certificate"
              placeholder="Upload Certificate"
              accept=".pdf"
              required
              disabled={isView}
            />
          )}
        </div>
      </div>
    </div>
  );
}
