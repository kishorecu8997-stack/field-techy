import { assetsConfig } from "@/assets";
import React from "react";
import { IoClose } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import {
  useAppDownloadProfileFile,
  type ProfileFileType,
} from "@/shared/apiServices/commonOpenApiService";
import LoaderComponent from "@/shared/components/commonUI/LoaderComponent";
import { Suspense } from "react";
import { useAdminGetEngineerById } from "@/shared/apiServices/admin/adminOpenApiService";

const PDFPreview = React.lazy(() => import("@/shared/components/PdfPreview"));
interface ViewFileComponentProps {
  onClose: () => void;
  title?: string;
  fileType: ProfileFileType | null;
  userId?: number | null;
  fileUrl?: string | null;
}

/**
 * ViewFileComponent Component
 *
 * Renders a modal for viewing and downloading profile files.
 *
 * @component
 * @returns {JSX.Element} The rendered ViewFileComponent component.
 */
const ViewFileComponent: React.FC<ViewFileComponentProps> = ({
  onClose,
  title = "View File",
  fileType,
  fileUrl,
  userId,
}) => {
  const shouldFetchFromAdmin =
    !!userId && !!fileType && !fileUrl;

  const {
    data: engineerDetails,
    isLoading: isEngineerLoading,
    isError: isEngineerError,
  } = useAdminGetEngineerById(userId ?? 0, shouldFetchFromAdmin);

  const adminFileUrl = (() => {
    const docs = engineerDetails?.documents;
    if (!docs || !fileType) return null;

    switch (fileType) {
      case "profilePicture":
        return docs.profileImage?.url ?? null;
      case "govIdDoc":
        return docs.governmentId?.url ?? null;
      case "certificateDoc":
        return docs.qualificationCertificate?.url ?? null;
      case "resumeFile":
        return docs.resume?.url ?? null;
      default:
        return null;
    }
  })();

  const {
    data: downloadData,
    isLoading,
    isError,
  } = useAppDownloadProfileFile(fileType, !!fileType && !fileUrl && !shouldFetchFromAdmin);

  const previewUrl =
    fileUrl ?? adminFileUrl ?? downloadData?.downloadUrl ?? undefined;

  const handleDownload = async () => {
    if (previewUrl) {
      const response = await fetch(previewUrl);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileType || "document";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    }
  };

  const renderDocumentPreview = () => {
    if (isLoading || isEngineerLoading) {
      return (
        <div className="flex items-center justify-center p-8 min-h-[400px]">
          <LoaderComponent />
        </div>
      );
    }

    if (isError || isEngineerError || !previewUrl) {
      return (
        <div className="text-center p-8 min-h-[400px] flex flex-col items-center justify-center">
          <img
            src={assetsConfig.placeholder}
            alt="No Preview"
            className="w-32 h-32 mx-auto mb-4 opacity-50"
          />
          <p className="text-gray-500">Document not found or access denied</p>
        </div>
      );
    }

    const isPdfByExt = previewUrl.match(/\.pdf(\?|$)/i);
    const isImageByExt = previewUrl.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i);

    if (isPdfByExt) return renderPdfPreview();
    if (isImageByExt) return renderImagePreview();

    if (fileType === "resumeFile") return renderPdfPreview();
    if (fileType === "profilePicture") return renderImagePreview();

    // Default to PDF for other document types without extension
    return renderPdfPreview();
  };

  const renderImagePreview = () => (
    <img
      src={previewUrl}
      alt="Document Preview"
      className="w-full h-full dark:text-white object-contain"
    />
  );

  const renderPdfPreview = () => (
    <Suspense
      fallback={
        <div className="w-full h-[500px] flex items-center justify-center bg-gray-50 rounded-lg border">
          <LoaderComponent />
        </div>
      }
    >
      <div className="w-full flex items-center justify-center">
        <PDFPreview
          key={previewUrl}
          url={previewUrl}
          className="h-[300px]"
        />
      </div>
    </Suspense>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-2xl w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {previewUrl && (
            <div
              onClick={handleDownload}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
              title="Download"
            >
              <FiDownload className="h-5 w-5" />
            </div>
          )}
          <IoClose
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 h-7 w-7 cursor-pointer"
            onClick={onClose}
          />
        </div>
      </div>

      <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="relative bg-gray-200 dark:bg-gray-800 flex items-center justify-center min-h-[300px]">
          {renderDocumentPreview()}
        </div>
      </div>
    </div>
  );
};

export default ViewFileComponent;
