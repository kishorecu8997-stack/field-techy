import { Button } from "@/shared/components/commonUI/Buttons";
import DocumentCard from "@/shared/components/DocumentCard";
import React, { useMemo } from "react";
import {
  useDeleteEngineerFile,
  useEngineerGetFiles,
} from "@/shared/apiServices/engineer/engineerService";
import type { EngineerFile } from "@/shared/apiServices/engineer/engineerTypes";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { toast } from "react-toastify";
import { useEngineerFilesContext } from "../context/useEngineerFilesContext";
import { getUserId } from "@/utils";
import { usePopupStore } from "@/shared/store/popupStore";
import { useAppDownloadProfileFile } from "@/shared/apiServices/commonOpenApiService";

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
 * Maps EngineerFile fileType to Document fileType
 */
const mapFileType = (
  fileType: EngineerFile["fileType"],
  mimeType: string,
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
  const { showPopup } = usePopupStore();
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
      (file) => file.fileType !== "PICTURE",
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

  const { data: resumeData } = useAppDownloadProfileFile("resumeFile");
  const { data: govIdData } = useAppDownloadProfileFile("govIdDoc");
  const { data: certificateData } = useAppDownloadProfileFile("certificateDoc");

  const previewUrlsMap = useMemo(() => {
    const urls: Record<string, string> = {};
    if (resumeData?.downloadUrl) urls["RESUME"] = resumeData.downloadUrl;
    if (govIdData?.downloadUrl) urls["GOVERNMENT_ID"] = govIdData.downloadUrl;
    if (certificateData?.downloadUrl)
      urls["CERTIFICATE"] = certificateData.downloadUrl;
    return urls;
  }, [resumeData, govIdData, certificateData]);

  const documents: Document[] = useMemo(() => {
    return engineerFiles.map((file: EngineerFile, index: number) => {
      const fileType = mapFileType(file.fileType, file.mimeType);
      const uploadDate = file.createdAt
        ? new Date(file.createdAt).toLocaleDateString()
        : undefined;

      const metadata: Record<string, string> = {
        fileId: file.id,
        fileKey: file.fileKey,
        engineerId: file.engineerId,
        mimeType: file.mimeType,
        size: file.size.toString(),
      };

      return {
        id: index, // Use index as numeric ID for DocumentCard compatibility
        title: file.fileName || `Document ${index + 1}`,
        fileName: file.fileName,
        fileType,
        previewUrl: previewUrlsMap[file.fileType],
        uploadDate,
        metadata,
        expiryDate: undefined,
        status: undefined,
      };
    });
  }, [engineerFiles, previewUrlsMap]);

  const handleEdit = (id: number) => {
    onEditDocument?.(id);
  };

  const handleDelete = async (id: number) => {
    const document = documents[id];
    const fileId = document?.metadata?.fileId;

    if (!fileId) {
      toast.error("Cannot delete: File ID not found");
      return;
    }

    await showPopup({
      title: "Delete Document",
      body: "Are you sure you want to delete this document? This action cannot be undone.",
      actionButtons: [
        {
          label: "Cancel",
          value: "no",
          variant: "secondary",
          action: (close) => close(true),
        },
        {
          label: "Yes, delete",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            deleteFileMutation.mutate(fileId);
            close(true);
          },
        },
      ],
    });
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
