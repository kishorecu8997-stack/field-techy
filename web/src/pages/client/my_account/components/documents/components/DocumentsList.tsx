import {
  getDownloadUrl,
  useAppDeleteProfileFile,
  useAppDownloadProfileFile,
  useClientGetMyDocuments,
} from "@/shared/apiServices/client/clientOpenApiService";
import type { ProfileFileType } from "@/shared/apiServices/commonOpenApiService";
import { Button } from "@/shared/components/commonUI/Buttons";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import DocumentCard from "@/shared/components/DocumentCard";
import { usePopupStore } from "@/shared/store/popupStore";
import { useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

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
  size?: number | null;
  sectionHeading?: string;
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
  // Note: We drive the list from these hooks because the legacy 'clientFiles' list
  // currently doesn't capture the new profile-based file uploads.
  const { data: docsData, isLoading: isLoadingDocs } =
    useClientGetMyDocuments();

  const { data: govIdData, isLoading: isLoadingGovId } =
    useAppDownloadProfileFile("govIdDoc", !!docsData?.govIdDoc?.fileName);
  const { data: certificateData, isLoading: isLoadingCertificate } =
    useAppDownloadProfileFile(
      "certificateDoc",
      !!docsData?.certificateDoc?.fileName,
    );

  const { mutateAsync: deleteProfileFile } = useAppDeleteProfileFile();

  const [manualPreviewUrls, setManualPreviewUrls]: [
    Record<string, string>,
    React.Dispatch<React.SetStateAction<Record<string, string>>>,
  ] = useState({});
  /**
   * Maps legacy DocumentType to the new ProfileFileType
   */
  const mapToProfileFileType = (type?: string): ProfileFileType | null => {
    if (!type) return null;
    switch (type) {
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
    if (govIdData?.downloadUrl)
      fileData["GOVERNMENT_ID"] = {
        url: govIdData.downloadUrl,
      };
    if (certificateData?.downloadUrl)
      fileData["CERTIFICATE"] = {
        url: certificateData.downloadUrl,
      };

    return fileData;
  }, [govIdData, certificateData]);

  const documents: Document[] = useMemo(() => {
    const docMeta = [
      {
        type: "GOVERNMENT_ID",
        label: "Government ID",
        fallbackFileName: "government_id.pdf",
        sectionHeading: "Government ID",
      },
      {
        type: "CERTIFICATE",
        label: "Certificate",
        fallbackFileName: "certificate.pdf",
        sectionHeading: "Certificate",
      },
    ];

    const result: Document[] = [];

    docMeta.forEach((dm, index) => {
      const fileInfoFromApi =
        dm.type === "GOVERNMENT_ID"
          ? docsData?.govIdDoc
          : dm.type === "CERTIFICATE"
            ? docsData?.certificateDoc
            : undefined;

      if (!fileInfoFromApi?.fileName) return;

      const previewInfo = previewUrlsMap[dm.type];
      const previewUrl = previewInfo?.url || manualPreviewUrls[dm.type];

      if (!previewUrl) return;
      const displayTitle = `${dm.label} (${fileInfoFromApi.fileName})`;

      result.push({
        id: index,
        fileId: previewInfo?.id,
        title: displayTitle,
        fileName: fileInfoFromApi.fileName || dm.fallbackFileName,
        fileType: "PDF" as const,
        previewUrl,
        size: fileInfoFromApi.size ?? null,
        sectionHeading: dm.sectionHeading,
        metadata: {
          originalFileType: dm.type,
        },
      });
    });

    return result;
  }, [docsData, previewUrlsMap, manualPreviewUrls]);

  const isLoadingFiles =
    isLoadingDocs || isLoadingGovId || isLoadingCertificate;

  const handleEdit = (id: number) => {
    onEditDocument?.(id);
  };

  const handleDelete = async (id: number) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;

    await showPopup({
      title: "Delete Document",
      body: `Are you sure you want to delete ${doc.title}?`,
      actionButtons: [
        {
          label: "Cancel",
          value: "cancel",
          variant: "danger",
          action: (close) => close(true),
        },
        {
          label: "Delete",
          value: "delete",
          variant: "danger",
          action: async (close) => {
            try {
              const originalType = doc.metadata?.originalFileType;
              const fileType = mapToProfileFileType(originalType);
              if (!fileType) throw new Error("Unsupported file type");

              await deleteProfileFile({
                body: { fileType },
                headers: { authorization: "" },
              });

              toast.success(`${doc.title} deleted successfully.`);

              // Clear manual preview URL if it exists
              if (originalType) {
                setManualPreviewUrls((prev: Record<string, string>) => {
                  const newState = { ...prev };
                  delete newState[originalType];
                  return newState;
                });
              }

              // Invalidate download queries to refresh the list
              queryClient.invalidateQueries({
                predicate: (query) =>
                  Array.isArray(query.queryKey) &&
                  query.queryKey[0] &&
                  typeof query.queryKey[0] === "object" &&
                  (query.queryKey[0] as { _id?: string })._id ===
                    "appDownloadProfileFile",
              });

              queryClient.invalidateQueries({
                predicate: (query) =>
                  Array.isArray(query.queryKey) &&
                  query.queryKey[0] &&
                  typeof query.queryKey[0] === "object" &&
                  (query.queryKey[0] as { _id?: string })._id ===
                    "clientGetMyDocuments",
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
          setManualPreviewUrls((prev: Record<string, string>) => ({
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
    <div className="bg-white rounded-lg dark:bg-gray-800 p-4 shadow-sm">
      {onAddDocument && (
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Documents
          </h2>
          <Button
            variant="link"
            onClick={onAddDocument}
            className={`flex !flex-row !items-center text-teal-600 hover:text-teal-800 hover:underline font-medium text-base transition-colors cursor-pointer dark:text-teal-400 dark:hover:text-teal-200 [&>*]:flex [&>*]:items-center`}
          >
            <FaPlus className="h-5 w-5 shrink-0 pr-2" />
            Add Document
          </Button>
        </div>
      )}

      <hr className="border-gray-200 mb-4 dark:text-gray-300" />

      {documents.length > 0 ? (
        <div className="space-y-6">
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
