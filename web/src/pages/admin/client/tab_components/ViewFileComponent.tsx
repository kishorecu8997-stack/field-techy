import { assetsConfig } from "@/assets";
import React from "react";
import { IoClose } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";

interface ViewFileComponentProps {
  onClose: () => void;
  title?: string;
  downloadUrl?: string | null;
  documentType?: string | null;
}

const ViewFileComponent: React.FC<ViewFileComponentProps> = ({
  onClose,
  title = "View File",
  downloadUrl,
  documentType,
}) => {
  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("download", documentType || "document");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const renderDocumentPreview = () => {
    if (!downloadUrl) {
      return (
        <div className="text-gray-400 dark:text-gray-500">
          <img
            src={assetsConfig.placeholder}
            alt="Document Preview"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    // Check if it's an image type based on URL extension or documentType
    const isImage =
      downloadUrl.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i) ||
      ["profilePicture"].includes(documentType || "");

    // Check if it's a PDF
    const isPdf =
      downloadUrl.match(/\.pdf(\?|$)/i) ||
      ["resumeFile"].includes(documentType || "");

    if (isImage) {
      return (
        <img
          src={downloadUrl}
          alt="Document Preview"
          className="w-full h-full object-contain"
        />
      );
    }

    if (isPdf) {
      return (
        <iframe
          src={downloadUrl}
          title="PDF Preview"
          className="w-full h-full min-h-[400px]"
          sandbox="allow-same-origin allow-downloads"
          referrerPolicy="no-referrer"
        />
      );
    }

    // For other document types, show a preview with download option
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
        <p className="mb-4">Preview not available for this file type</p>
        <div
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <FiDownload className="h-5 w-5" />
          Download File
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-2xl w-full p-4">
      {/* Header with title and close button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {downloadUrl && (
            <div
              onClick={handleDownload}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
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

      {/* File preview area */}
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="relative aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          {renderDocumentPreview()}
        </div>
      </div>
    </div>
  );
};

export default ViewFileComponent;
