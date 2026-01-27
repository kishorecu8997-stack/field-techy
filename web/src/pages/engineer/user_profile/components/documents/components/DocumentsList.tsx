import { Button } from "@/shared/components/commonUI/Buttons";
import DocumentCard from "@/shared/components/DocumentCard";
import React, { useMemo, useState } from "react";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { toast } from "react-toastify";
import { usePopupStore } from "@/shared/store/popupStore";
import {
  useAppDownloadProfileFile,
  getDownloadUrl,
  useAppDeleteProfileFile,
} from "@/shared/apiServices/engineer/engineerOpenApiService";
import type { ProfileFileType } from "@/shared/apiServices/commonOpenApiService";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Document interface matching DocumentCard expectations
 */
export interface Document {
  id: number;
  title: string;
  fileName: string;
  category?: string;
  fileType: "PDF" | "PNG" | "JPEG" | "JPG" | "GIF" | "DOCX" | "XLSX";
  previewUrl?: string;
  fileId?: number;
  uploadDate?: string;
  description?: string;
  metadata?: Record<string, string>;
  expiryDate?: string;
  status?: "Pending" | "Approved" | "Rejected";
  allowMultiple?: boolean;
}

interface DocumentsListProps {
  onAddDocument?: () => void;
  onEditDocument?: (id: number) => void;
}

/**
 * Renders a list of documents with actions to add, edit, and delete.
 * Fetches files from OpenAPI and displays them using DocumentCard.
 */
const DocumentsList: React.FC<DocumentsListProps> = ({
  onAddDocument,
  onEditDocument,
}) => {
  const { showPopup } = usePopupStore();
  const queryClient = useQueryClient();

  // Specialized hooks for the 3 profile document types
  // Note: We drive the list from these hooks because the legacy 'engineerFiles' list
  // currently doesn't capture the new profile-based file uploads.
  const { data: resumeData, isLoading: isLoadingResume } =
    useAppDownloadProfileFile("resumeFile");
  const { data: govIdData, isLoading: isLoadingGovId } =
    useAppDownloadProfileFile("govIdDoc");
  const { data: certificateData, isLoading: isLoadingCertificate } =
    useAppDownloadProfileFile("certificateDoc");

  const { mutateAsync: deleteProfileFile } = useAppDeleteProfileFile();

  const [manualPreviewUrls, setManualPreviewUrls] = useState<
    Record<string, string>
  >({});

  /**
   * Maps legacy DocumentType to the new ProfileFileType
   */
  const mapToProfileFileType = (type: string): ProfileFileType | null => {
    switch (type) {
      case "RESUME":
        return "resumeFile";
      case "GOVERNMENT_ID":
        return "govIdDoc";
      case "CERTIFICATE":
        return "certificateDoc";
      default:
        return null;
    }
  };

  const previewUrlsMap = useMemo(() => {
    const fileData: Record<string, { url: string; id?: number }> = {};
    if (resumeData?.downloadUrl)
      fileData["RESUME"] = {
        url: resumeData.downloadUrl,
      };
    if (govIdData?.downloadUrl)
      fileData["GOVERNMENT_ID"] = {
        url: govIdData.downloadUrl,
      };
    if (certificateData?.downloadUrl)
      fileData["CERTIFICATE"] = {
        url: certificateData.downloadUrl,
      };

    return fileData;
  }, [resumeData, govIdData, certificateData]);

  const documents: Document[] = useMemo(() => {
    const docMeta = [
      { type: "RESUME", label: "Resume", fileName: "resume.pdf" },
      {
        type: "GOVERNMENT_ID",
        label: "Government ID",
        fileName: "government_id.pdf",
      },
      {
        type: "CERTIFICATE",
        label: "Certificate",
        fileName: "certificate.pdf",
      },
    ];

    return docMeta
      .map((dm, index) => {
        const fileInfo = previewUrlsMap[dm.type];
        const previewUrl = fileInfo?.url || manualPreviewUrls[dm.type];
        if (!previewUrl) return null;

        return {
          id: index,
          fileId: fileInfo?.id,
          title: dm.label,
          fileName: dm.fileName,
          fileType: "PDF" as const,
          previewUrl,
          metadata: {
            originalFileType: dm.type,
          },
        };
      })
      .filter(Boolean) as Document[];
  }, [previewUrlsMap, manualPreviewUrls]);

  const isLoadingFiles =
    isLoadingResume || isLoadingGovId || isLoadingCertificate;

  const handleEdit = (id: number) => {
    onEditDocument?.(id);
  };

  const handleDelete = async (id: number) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;

    if (!doc.fileId) {
      toast.error("Cannot delete: File ID is missing.");
      return;
    }

    await showPopup({
      title: "Delete Document",
      body: `Are you sure you want to delete ${doc.title}?`,
      actionButtons: [
        {
          label: "Cancel",
          value: "cancel",
          variant: "secondary",
          action: (close) => close(true),
        },
        {
          label: "Delete",
          value: "delete",
          variant: "danger",
          action: async (close) => {
            try {
              await deleteProfileFile({
                body: { fileId: doc.fileId! },
                headers: { authorization: "" },
              });
              toast.success(`${doc.title} deleted successfully.`);
              // Invalidate download queries to refresh the list
              queryClient.invalidateQueries({
                predicate: (query) =>
                  Array.isArray(query.queryKey) &&
                  query.queryKey[0] &&
                  typeof query.queryKey[0] === "object" &&
                  (query.queryKey[0] as any)._id === "appDownloadProfileFile",
              });
            } catch (error) {
              toast.error("Failed to delete document.");
              console.error("Delete error:", error);
            }
            close(true);
          },
        },
      ],
    });
  };

  const handleDownload = async (id: number) => {
    const doc = documents.find((d) => d.id === id);
    const originalType = doc?.metadata?.originalFileType;
    const profileFileType = originalType
      ? mapToProfileFileType(originalType)
      : null;

    if (!profileFileType) {
      toast.error("Download failed: Unsupported file type");
      return;
    }

    try {
      const data = await getDownloadUrl(profileFileType);
      if (data?.downloadUrl) {
        const link = window.document.createElement("a");
        link.href = data.downloadUrl;
        link.target = "_blank";
        link.setAttribute("download", doc?.fileName || "download");
        window.document.body.appendChild(link);
        link.click();
        link.remove();

        // Update the manual preview URLs map to refresh UI if needed
        if (originalType) {
          setManualPreviewUrls((prev) => ({
            ...prev,
            [originalType]: data.downloadUrl!,
          }));
        }

        toast.success("Download started");
      } else {
        throw new Error("No download URL returned");
      }
    } catch (error) {
      toast.error("Failed to get download URL");
      console.error("Download error:", error);
    }
  };

  if (isLoadingFiles) {
    return (
      <div className="bg-white rounded-lg p-8">
        <div className="flex items-center justify-center">
          <LoaderComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      {onAddDocument && (
        <div className="flex justify-end items-center mb-4">
          <Button
            variant="link"
            onClick={onAddDocument}
            className="text-blue-600 hover:text-blue-800 font-medium flex gap-1"
          >
            Add Document
          </Button>
        </div>
      )}

      {documents.length > 0 ? (
        <div className="space-y-4">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.metadata?.originalFileType || doc.id}
              document={doc}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDownload={handleDownload}
              id={doc.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No documents added yet. Click "Add Document" to get started.
        </div>
      )}
    </div>
  );
};

export default DocumentsList;
