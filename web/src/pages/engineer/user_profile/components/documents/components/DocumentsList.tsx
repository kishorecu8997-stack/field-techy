import { Button } from "@/shared/components/commonUI/Buttons";
import DocumentCard from "@/shared/components/DocumentCard";
import React, { useEffect, useMemo, useState } from "react";
import {
  useDeleteEngineerFile,
  useEngineerGetFiles,
} from "@/shared/apiServices/engineer/engineerService";
import type { EngineerFile } from "@/shared/apiServices/engineer/engineerTypes";
import { EngineerAdapter } from "@/shared/apiServices/engineer/engineerAdapter";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { toast } from "react-toastify";
import { useEngineerFilesContext } from "../context/useEngineerFilesContext";
import { getUserId } from "@/utils";

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
  expiryDate?: string;
  status?: "Pending" | "Approved" | "Rejected";
}

interface DocumentsListProps {
  onAddDocument?: () => void;
  onEditDocument?: (id: number) => void;
}

/**
 * Maps EngineerFile fileType to Document fileType
 */
const mapFileType = (
  fileType: EngineerFile["fileType"],
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
  if (
    fileType === "GOVERNMENT_ID" ||
    fileType === "CERTIFICATE" ||
    fileType === "RESUME"
  )
    return "PDF";
  if (fileType === "PICTURE") return "JPEG";

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
  const userId = useMemo(() => getUserId(), []);
  const contextData = useEngineerFilesContext();

  if (!userId) {
    return (
      <div className="bg-white rounded-lg p-8 text-center text-gray-500">
        Unable to load user session. Please log in again.
      </div>
    );
  }

  const filesQuery = useEngineerGetFiles(userId);

  const engineerFiles = useMemo(() => {
    if (contextData) {
      return contextData.files;
    }

    return (filesQuery.data || []).filter(
      (file) => file.fileType !== "PICTURE"
    );
  }, [contextData, filesQuery.data]);

  const isLoadingFiles = contextData
    ? contextData.isLoading
    : filesQuery.isLoading;

  const refetchFiles = contextData ? contextData.refetch : filesQuery.refetch;

  const deleteFileMutation = useDeleteEngineerFile({
    engineerId: userId,
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
    if (!engineerFiles.length) {
      setPreviewUrls({});
      setPreviewErrors({});
      setIsLoadingPreviews(false);
      return;
    }

    // Check if we need to download any new files
    const filesToDownload = engineerFiles.filter(
      (file: EngineerFile) => !downloadedFileIds.has(file.id)
    );

    if (filesToDownload.length === 0) {
      // All files already downloaded
      return;
    }

    setIsLoadingPreviews(true);
    setPreviewErrors({});

    const downloadFiles = async () => {
      // Download all files in parallel using Promise.allSettled
      const downloadPromises = filesToDownload.map(
        async (file: EngineerFile) => {
          try {
            const downloadResponse = await EngineerAdapter.downloadFileStream(
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
        }
      );

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
            (result.reason as any)?.message ||
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

    downloadFiles().catch((error) => {
      // Fallback error handling to keep state consistent if downloadFiles throws
      // unexpectedly (e.g., logic error, aborted request outside allSettled, etc.).
      // We clear previews and errors and stop the loading state so the UI does not
      // remain stuck in an inconsistent "loading" state.
      console.error("Failed to download document previews:", error);
      setPreviewUrls({});
      setPreviewErrors({
        __global__: "Failed to load document previews. Please try again later.",
      });
      setIsLoadingPreviews(false);
      toast.error("Failed to load document previews. Please try again later.");
    });
  }, [engineerFiles]);

  useEffect(() => {
    const currentFileIds = new Set(engineerFiles.map((file) => file.id));

    const urlsToRevoke: string[] = [];
    Object.entries(previewUrls).forEach(([fileId, url]) => {
      if (!currentFileIds.has(fileId)) {
        urlsToRevoke.push(url);
      }
    });

    urlsToRevoke.forEach((url) => URL.revokeObjectURL(url));

    if (urlsToRevoke.length > 0) {
      setPreviewUrls((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((id) => {
          if (!currentFileIds.has(id)) delete updated[id];
        });
        return updated;
      });

      setDownloadedFileIds((prev) => {
        const updated = new Set(prev);
        Array.from(prev).forEach((id) => {
          if (!currentFileIds.has(id)) updated.delete(id);
        });
        return updated;
      });
    }
  }, [engineerFiles]);

  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);
  const documents: Document[] = useMemo(() => {
    return engineerFiles
      .filter(
        (file: EngineerFile) =>
          downloadedFileIds.has(file.id) || !isLoadingPreviews
      )
      .map((file: EngineerFile, index: number) => {
        const fileType = mapFileType(file.fileType, file.mimeType);
        // EngineerFile usually has updatedAt or createdAt.
        const uploadDate = file.createdAt
          ? new Date(file.createdAt).toLocaleDateString()
          : undefined;
        const previewError = previewErrors[file.id];

        const metadata: Record<string, string> = {
          fileId: file.id,
          fileKey: file.fileKey,
          engineerId: file.engineerId,
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
          // TODO: Implement expiry date - need to add this field to EngineerFile type or fetch from separate API
          expiryDate: undefined,
          // TODO: Implement status - need to add this field to EngineerFile type or fetch from separate API
          status: undefined,
        };
      });
  }, [
    engineerFiles,
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
  if (isLoadingPreviews && engineerFiles.length > 0) {
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
