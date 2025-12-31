import { Button } from "@/shared/components/commonUI/Buttons";
import DocumentCard from "@/shared/components/DocumentCard";
import React, { useEffect, useMemo, useState } from "react";
import {
  useDeleteClientFile,
  useClientFiles,
} from "@/shared/apiServices/client/clientService";
import { useCurrentClientProfile } from "@/shared/apiServices/profiles/client/clientProfileService";
import type { ClientFile } from "@/shared/apiServices/client/clientTypes";
import { ClientAdapter } from "@/shared/apiServices/client/clientAdapter";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { toast } from "react-toastify";
import { useClientFilesContext } from "../../../context/ClientFilesContext";

/**
 * Document interface matching DocumentCard expectations
 */
export interface Document {
  id: number;
  title: string;
  fileName: string;
  fileType: "PDF" | "PNG" | "JPEG" | "JPG" | "GIF" | "DOCX" | "XLSX";
  previewUrl?: string;
  uploadDate?: string;
  description?: string;
  metadata?: Record<string, string>;
  // TODO: Implement expiry date functionality
  expiryDate?: string;
  // TODO: Implement status functionality (Pending | Approved | Rejected)
  status?: "Pending" | "Approved" | "Rejected";
}

interface DocumentsListProps {
  onAddDocument?: () => void;
  onEditDocument?: (id: number) => void;
}

/**
 * Maps ClientFile fileType to Document fileType
 */
const mapFileType = (
  fileType: ClientFile["fileType"],
  mimeType: string
): Document["fileType"] => {
  // Check mime type first for more accurate detection
  if (mimeType.includes("pdf")) return "PDF";
  if (mimeType.includes("png")) return "PNG";
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) return "JPEG";
  if (mimeType.includes("gif")) return "GIF";
  if (
    mimeType.includes("word") ||
    mimeType.includes("document") ||
    mimeType.includes("docx")
  )
    return "DOCX";
  if (
    mimeType.includes("excel") ||
    mimeType.includes("spreadsheet") ||
    mimeType.includes("xlsx")
  )
    return "XLSX";

  // Fallback to fileType enum
  if (fileType === "GOVERNMENT_ID" || fileType === "CERTIFICATE") return "PDF";
  if (fileType === "PROFILE_PICTURE") return "JPEG";

  return "PDF"; // Default fallback
};

/**
 * Renders a list of documents with actions to add, edit, and delete.
 * Fetches files from API and displays them using DocumentCard.
 * @param {DocumentsListProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered list of documents.
 */
const DocumentsList: React.FC<DocumentsListProps> = ({
  onAddDocument,
  onEditDocument,
}) => {
  // Always call hooks (React rules)
  const contextData = useClientFilesContext();
  const { data: clientProfile } = useCurrentClientProfile();
  const clientId = clientProfile?.id || "9f034ed8-2ea5-44b6-a410-973e559e2c47";
  const filesQuery = useClientFiles(clientId);

  // Use context if available, otherwise use direct query
  const clientFiles = useMemo(() => {
    if (contextData) {
      return contextData.files; // Already filtered in context
    }
    // Filter out PROFILE_PICTURE if fetching directly
    return (filesQuery.data || []).filter(
      (file) => file.fileType !== "PROFILE_PICTURE"
    );
  }, [contextData, filesQuery.data]);

  const isLoadingFiles = contextData
    ? contextData.isLoading
    : filesQuery.isLoading;

  const refetchFiles = contextData ? contextData.refetch : filesQuery.refetch;

  // Delete mutation
  const deleteFileMutation = useDeleteClientFile({
    onSuccess: () => {
      toast.success("Document deleted successfully");
      refetchFiles();
    },
    onError: (error) => {
      toast.error("Failed to delete document");
      console.error("Delete error:", error);
    },
  });

  // State to store blob URLs for previews
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [previewErrors, setPreviewErrors] = useState<Record<string, string>>(
    {}
  );
  const [isLoadingPreviews, setIsLoadingPreviews] = useState(false);
  const [downloadedFileIds, setDownloadedFileIds] = useState<Set<string>>(
    new Set()
  );

  // Download files and create preview URLs using Promise.allSettled
  useEffect(() => {
    if (!clientFiles.length) {
      setPreviewUrls({});
      setPreviewErrors({});
      setIsLoadingPreviews(false);
      return;
    }

    // Check if we need to download any new files
    const filesToDownload = clientFiles.filter(
      (file) => !downloadedFileIds.has(file.id)
    );

    if (filesToDownload.length === 0) {
      // All files already downloaded
      return;
    }

    setIsLoadingPreviews(true);
    setPreviewErrors({});

    const downloadFiles = async () => {
      // Download all files in parallel using Promise.allSettled
      const downloadPromises = filesToDownload.map(async (file) => {
        try {
          const downloadResponse = await ClientAdapter.downloadFileStream(
            file.fileKey
          );
          const blobUrl = URL.createObjectURL(downloadResponse.blob);
          return {
            fileId: file.id,
            success: true as const,
            blobUrl,
            error: null,
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : `Failed to download ${file.fileName || "file"}`;
          console.error(`Failed to download file ${file.id}:`, error);
          return {
            fileId: file.id,
            success: false as const,
            blobUrl: null,
            error: errorMessage,
          };
        }
      });

      // Wait for all downloads to complete (successful or failed)
      const results = await Promise.allSettled(downloadPromises);

      // Process results
      const newPreviewUrls: Record<string, string> = {};
      const newPreviewErrors: Record<string, string> = {};
      const newDownloadedFileIds = new Set(downloadedFileIds);

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const { fileId, success, blobUrl, error } = result.value;
          newDownloadedFileIds.add(fileId);

          if (success && blobUrl) {
            newPreviewUrls[fileId] = blobUrl;
          } else if (error) {
            newPreviewErrors[fileId] = error;
          }
        } else {
          // Promise was rejected (shouldn't happen with allSettled, but handle it)
          const file = filesToDownload[index];
          newDownloadedFileIds.add(file.id);
          newPreviewErrors[file.id] =
            result.reason?.message ||
            `Failed to download ${file.fileName || "file"}`;
        }
      });

      // Update state with all results at once
      setPreviewUrls((prev) => ({ ...prev, ...newPreviewUrls }));
      setPreviewErrors((prev) => ({ ...prev, ...newPreviewErrors }));
      setDownloadedFileIds(newDownloadedFileIds);
      setIsLoadingPreviews(false);

      // Show toast for any errors
      const errorCount = Object.keys(newPreviewErrors).length;
      if (errorCount > 0) {
        toast.warning(
          `Failed to load ${errorCount} preview${
            errorCount > 1 ? "s" : ""
          }. Please try again later.`
        );
      }
    };

    downloadFiles();
  }, [clientFiles, downloadedFileIds]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    const urls = Object.values(previewUrls);
    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  // Map ClientFile to Document format
  // Only include documents that have been processed (downloaded or failed)
  const documents: Document[] = useMemo(() => {
    return clientFiles
      .filter((file) => downloadedFileIds.has(file.id) || !isLoadingPreviews)
      .map((file, index) => {
        const fileType = mapFileType(file.fileType, file.mimeType);
        const uploadDate = file.createdAt
          ? new Date(file.createdAt).toLocaleDateString()
          : undefined;
        const previewError = previewErrors[file.id];

        const metadata: Record<string, string> = {
          fileId: file.id,
          fileKey: file.fileKey,
          clientId: file.clientId,
          mimeType: file.mimeType,
          size: file.size.toString(),
        };

        // Add preview error to metadata if present
        if (previewError) {
          metadata.previewError = previewError;
        }

        return {
          id: index, // Use index as numeric ID for DocumentCard compatibility
          title: file.fileName || `Document ${index + 1}`,
          fileName: file.fileName,
          fileType,
          previewUrl: previewUrls[file.id], // Will be undefined if download failed
          uploadDate,
          description: previewError
            ? `Preview failed: ${previewError}`
            : undefined,
          metadata,
          // TODO: Implement expiry date - need to add this field to ClientFile type or fetch from separate API
          expiryDate: undefined,
          // TODO: Implement status - need to add this field to ClientFile type or fetch from separate API
          status: undefined,
        };
      });
  }, [
    clientFiles,
    previewUrls,
    previewErrors,
    downloadedFileIds,
    isLoadingPreviews,
  ]);

  const handleEdit = (id: number) => {
    onEditDocument?.(id);
  };

  const handleDelete = (id: number) => {
    const document = documents[id];
    if (!document?.metadata?.fileId) {
      toast.error("Cannot delete: File ID not found");
      return;
    }

    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteFileMutation.mutate(document.metadata.fileId);
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

  // Show loading state while previews are being downloaded
  if (isLoadingPreviews && clientFiles.length > 0) {
    return (
      <div className="bg-white rounded-lg ">
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
        <div className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <LoaderComponent />
            <p className="text-sm text-gray-600">
              Loading document previews...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg ">
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
          {documents.map((doc, index) => (
            <DocumentCard
              key={doc.metadata?.fileId || index}
              document={doc}
              onEdit={handleEdit}
              onDelete={handleDelete}
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
